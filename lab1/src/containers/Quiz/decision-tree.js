var dt = (function () {
    
    var matches = []
    function DecisionTree(builder) {        
        this.root = buildDecisionTree({
            trainingSet: builder.trainingSet,
            ignoredAttributes: arrayToHashSet(builder.ignoredAttributes),
            categoryAttr: builder.categoryAttr || 'category',
            minItemsCount: builder.minItemsCount || 1,
            entropyThrehold: builder.entropyThrehold || 0.01,
            maxTreeDepth: builder.maxTreeDepth || 70
        });
    }
          
    DecisionTree.prototype.predict = function (item) {
        return predict(this.root, item, matches);
    }
    function RandomForest(builder, treesNumber) {
        this.trees = buildRandomForest(builder, treesNumber);
    }
          
    RandomForest.prototype.predict = function (item) {
        return predictRandomForest(this.trees, item);
    }

    function arrayToHashSet(array) {
        var hashSet = {};
        if (array) {
            for(var i in array) {
                var attr = array[i];
                hashSet[attr] = true;
            }
        }
        return hashSet;
    }
    
    function countUniqueValues(items, attr) {
        var counter = {};

        for (let i = items.length - 1; i >= 0; i--) {
            counter[items[i][attr]] = 0;
        }
          
        for (let i = items.length - 1; i >= 0; i--) {
            counter[items[i][attr]] += 1;
        }

        return counter;
    }
    
    function entropy(items, attr) {
        var counter = countUniqueValues(items, attr);

        var entropy = 0;
        var p;
        for (var i in counter) {
            p = counter[i] / items.length;
            entropy += -p * Math.log(p);
        }

        return entropy;
    }
          

    function split(items, attr, predicate, pivot) {
        var match = [];
        var notMatch = [];
        var item,
            attrValue;
          
        for (var i = items.length - 1; i >= 0; i--) {
            item = items[i];
            attrValue = item[attr];

            if (predicate(attrValue, pivot)) { 
                match.push(item);
            } else {
                notMatch.push(item);
            }
        };

        return {
            match: match,
            notMatch: notMatch
        };
    }


    function mostFrequentValue(items, attr) {
        var counter = countUniqueValues(items, attr);

        var mostFrequentCount = 0;
        var mostFrequentValue;

        for (var value in counter) {
            if (counter[value] > mostFrequentCount) {
                mostFrequentCount = counter[value];
                mostFrequentValue = value;
            }
        };

        return mostFrequentValue;
    }
          
    var predicates = {
        '==': function (a, b) { return a === b },
        '>=': function (a, b) { return a >= b }
    };

    function buildDecisionTree(builder) {

        var trainingSet = builder.trainingSet;
        var minItemsCount = builder.minItemsCount;
        var categoryAttr = builder.categoryAttr;
        var entropyThrehold = builder.entropyThrehold;
        var maxTreeDepth = builder.maxTreeDepth;
        var ignoredAttributes = builder.ignoredAttributes;

        if ((maxTreeDepth === 0) || (trainingSet.length <= minItemsCount)) {
            return {
                category: mostFrequentValue(trainingSet, categoryAttr)
            };
        }

        var initialEntropy = entropy(trainingSet, categoryAttr);

        if (initialEntropy <= entropyThrehold) {
            return {
                category: mostFrequentValue(trainingSet, categoryAttr)
            };
        }

        var alreadyChecked = {};
          
        var bestSplit = {gain: 0};

        for (var i = trainingSet.length - 1; i >= 0; i--) {
            var item = trainingSet[i];

            for (var attr in item) {
                if ((attr === categoryAttr) || ignoredAttributes[attr]) {
                    continue;
                }

                var pivot = item[attr];

                var predicateName;
                if (typeof pivot == 'number') {
                    predicateName = '>=';
                } else {
                    predicateName = '==';
                }

                var attrPredPivot = attr + predicateName + pivot;
                if (alreadyChecked[attrPredPivot]) {
                    continue;
                }
                alreadyChecked[attrPredPivot] = true;

                var predicate = predicates[predicateName];
          
                var currSplit = split(trainingSet, attr, predicate, pivot);

                var matchEntropy = entropy(currSplit.match, categoryAttr);
                var notMatchEntropy = entropy(currSplit.notMatch, categoryAttr);

                var newEntropy = 0;
                newEntropy += matchEntropy * currSplit.match.length;
                newEntropy += notMatchEntropy * currSplit.notMatch.length;
                newEntropy /= trainingSet.length;
                var currGain = initialEntropy - newEntropy;

                if (currGain > bestSplit.gain) {
                    bestSplit = currSplit;
                    bestSplit.predicateName = predicateName;
                    bestSplit.predicate = predicate;
                    bestSplit.attribute = attr;
                    bestSplit.pivot = pivot;
                    bestSplit.gain = currGain;
                }
            }
        }

        if (!bestSplit.gain) {
            return { category: mostFrequentValue(trainingSet, categoryAttr) };
        }

          
        builder.maxTreeDepth = maxTreeDepth - 1;

        builder.trainingSet = bestSplit.match;
        var matchSubTree = buildDecisionTree(builder);

        builder.trainingSet = bestSplit.notMatch;
        var notMatchSubTree = buildDecisionTree(builder);

        return {
            attribute: bestSplit.attribute,
            predicate: bestSplit.predicate,
            predicateName: bestSplit.predicateName,
            pivot: bestSplit.pivot,
            match: matchSubTree,
            notMatch: notMatchSubTree,
            matchedCount: bestSplit.match.length,
            notMatchedCount: bestSplit.notMatch.length
        };
    }

    function predict(tree, item, matches) {
        var attr,
            value,
            predicate,
            pivot;
        while(true) {
          
            if (tree.category) {
                matches.push(tree.category)
                return tree.category;
            }

            attr = tree.attribute;
            value = item[attr];

            predicate = tree.predicate;
            pivot = tree.pivot;

            if (predicate(value, pivot)) {
                tree = tree.match;
                matches.push(tree.match)
            } else {
                tree = tree.notMatch;
            }
        }
    }

    function buildRandomForest(builder, treesNumber) {
        var items = builder.trainingSet;
          
        var trainingSets = [];
        for (let t = 0; t < treesNumber; t++) {
            trainingSets[t] = [];
        }
        for (var i = items.length - 1; i >= 0 ; i--) {
          var correspondingTree = i % treesNumber;
          trainingSets[correspondingTree].push(items[i]);
        }

        var forest = [];
        for (let t = 0; t < treesNumber; t++) {
            builder.trainingSet = trainingSets[t];

            var tree = new DecisionTree(builder);
            forest.push(tree);
        }
        return forest;
    }

    function predictRandomForest(forest, item) {
        var result = {};
        for (var i in forest) {
            var tree = forest[i];
            var prediction = tree.predict(item);
            result[prediction] = result[prediction] ? result[prediction] + 1 : 1;
        }
        return result;
    }

    var exports = {};
    exports.DecisionTree = DecisionTree;
    exports.RandomForest = RandomForest;
    return exports;
})();