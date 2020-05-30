//budgetController module
var budgetController = (function() {
    //Some Code
    var Expense = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
        this.percentage = -1;
    };

    Expense.prototype.calcPercentage = function(totalIncome) {
        if (totalIncome > 0) {
            this.percentage = Math.round((this.value / totalIncome) * 100);
        } else {
            this.percentage = -1;
        }
    };

    Expense.prototype.getPercentage = function() {
        return this.percentage;
    };

    var Income = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };

    var calculateTotal = function(type) {
        var sum = 0;
        data.allItems[type].forEach(function (current) {
            sum += current.value;
        });
        data.totals[type] = sum;
    };

    var data = {
        allItems: {
            exp: [],
            inc:[]
        },
        totals: {
            exp: 0,
            inc:0
        },
        budget : 0,
        percentage : -1
    };

    return {
        addItem: function(type, des, val) {
            var ID, newItem;

            if(data.allItems[type].length > 0) {
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
            }
            else {
                ID = 0;
            }
            
            
            if(type === 'exp')
                newItem = new Expense(ID, des, val);
            else 
                newItem = new Income(ID, des, val);

            data.allItems[type].push(newItem);
            return newItem;
            
        }, 

        deleteItem: function(type, id) {
            var ids, index;

            ids = data.allItems[type].map(function(current) {
                return current.id;
            });

            index = ids.indexOf(id);

            if(index !== -1) {
                data.allItems[type].splice(index, 1);
            }
        },

        calculateBudget : function() {
            // calculate total inc and exp
            calculateTotal('exp');
            calculateTotal('inc');

            //calculate budget : inc - exp
            data.budget = data.totals.inc - data.totals.exp;

            //cal the percentage of income that we spent
            if(data.totals.inc > 0)
                data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
            else 
                data.percentage = -1;
        },

        calculatePercentages: function() {
            data.allItems.exp.forEach(function(current) {
                current.calcPercentage(data.totals.inc);
            });
        },

        getPercentages : function() {
            var allPerc = data.allItems.exp.map(function(current) {
                return current.getPercentage();
            });
            return allPerc;
        },

        getBudget: function() {
            return {
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp : data.totals.exp,
                percentage : data.percentage
            };
        },

        testing : function() {
            console.log(data);
        }
    }
})();


//UI Controller
var UIController = (function() {

    var domStrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue:'.add__value',
        inputBtn: '.add__btn',
        incomeContainer: '.income__list',
        expensesContainer: '.expenses__list',
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expensesLabel: '.budget__expenses--value',
        percentageLabel: '.budget__expenses--percentage',
        container: '.container',
        expensesPercLabel: '.item__percentage',
        dateLabel:'.budget__title--month'
    };

    var formateNumber = function(num, type) {
        var numSplit, int, dec;
        num = Math.abs(num);
        num = num.toFixed(2);


        numSplit = num.split('.');
        int = numSplit[0];
        if(int.length > 3) {
            int = int.substr(0, int.length - 3) + ',' +int.substr(int.length - 3, 3);
        }

        dec = numSplit[1];

        return (type==='exp' ? '-' : '+') + ' ' + int + '.' + dec;
    };

    var nodeListForEach = function(list, callback) {
        for(var i= 0;i<list.length; i++) {
            callback(list[i], i);
        }
    };

    return {
        getInput : function() {
            return {
                type : document.querySelector(domStrings.inputType).value,
                description : document.querySelector(domStrings.inputDescription).value,
                value : parseFloat(document.querySelector(domStrings.inputValue).value)
            };
        },
        addListItem: function (obj, type){
            var html, newHtml, element;
            //create HTML string with place holdertxt
            if (type === 'inc') {
                element = domStrings.incomeContainer;
                
                html = '<div class="item clearfix" id="inc-%id%"> <div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            } else if (type === 'exp') {
                element = domStrings.expensesContainer;
                
                html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }

            //Replace placeholder txt with at\ctual data
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%',obj.description);
            newHtml = newHtml.replace('%value%',formateNumber(obj.value, type));
            //inster the html

            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
        },

        deleteListItem: function(selectorID) {
            var el = document.getElementById(selectorID);
            el.parentNode.removeChild(el);
        },

        clearFileds : function() {
            var fields, fieldsArr;

            //will return LIST -> convert to Array
            fields = document.querySelectorAll(domStrings.inputDescription + ', ' + domStrings.inputValue);

            fieldsArr = Array.prototype.slice.call(fields);
            console.log(fieldsArr);

            fieldsArr.forEach(function(current, index, array) {
                current.value = "";
            });

            fieldsArr[0].focus();
        },

        displayBudget : function(obj) {
            var type;
            obj.budget > 0 ? type = 'inc' : type ='exp';

            document.querySelector(domStrings.budgetLabel).textContent = formateNumber(obj.budget, type);
            document.querySelector(domStrings.incomeLabel).textContent = formateNumber(obj.totalInc, 'inc');
            document.querySelector(domStrings.expensesLabel).textContent = formateNumber(obj.totalExp, 'exp');
            
            if (obj.percentage > 0 ) {
                document.querySelector(domStrings.percentageLabel).textContent = obj.percentage;
            }
            else {
                document.querySelector(domStrings.percentageLabel).textContent = '---';
            }
        },

        displayPercentages: function(percentages) {
            var fields = document.querySelectorAll(domStrings.expensesPercLabel);

            nodeListForEach(fields, function(current, index){
                if(percentages[index] > 0)
                    current.textContent = percentages[index] + '%';
                else 
                current.textContent = '---';
            });
        },

        displayMonth : function() {
            var now, year, monthI; 
            var month = ['january','february','march','april','may','june','july','august','september','octuber','november','december'];
            now = new Date();
            monthI = now.getMonth();
            year = now.getFullYear();
            
            document.querySelector(domStrings.dateLabel).textContent = month[monthI] + ' ' + year;
        },

        changedType : function() {
            var fields = document.querySelectorAll(
                domStrings.inputType + ',' + domStrings.inputDescription + ',' + domStrings.inputValue
            );
            nodeListForEach(fields,function(cur) {
                cur.classList.toggle('red-focus');
            })
            document.querySelector(domStrings.inputBtn).classList.toggle('red');

        },

        getDomStrings: function() {
            return domStrings;
        }
    } 

})();


//Global APP controller
var controller = (function (budgetCtrl, UICtrl) {

    var setupEventListener = function() {
        var Dom = UICtrl.getDomStrings();
        document.querySelector(Dom.inputBtn).addEventListener('click', ctrlAddItem);

        document.addEventListener('keypress',function(event) {
            if(event.keyCode === 13 || event.which === 13) {
                ctrlAddItem();
            }
        });

        document.querySelector(Dom.container).addEventListener('click', ctrlDeleteItem);

        document.querySelector(Dom.inputType).addEventListener('change', UICtrl.changedType);
    }

    var updateBudget = function() {
        //1. Caculate the budget
        budgetCtrl.calculateBudget();

        //2. Return the budget
        var budget = budgetCtrl.getBudget();

        //3. display the budget on the UI
        UICtrl.displayBudget(budget);

    };

    var updatePercentages = function() {

        //1. Calculate percentages
        budgetCtrl.calculatePercentages();

        // 2. Read percentage from the budget controller
        var percentages = budgetCtrl.getPercentages();


        // 3. Update the UI with new percentages
        UICtrl.displayPercentages(percentages);
    };

    var ctrlAddItem = function () {
        var newItem, input;
        
        input = UICtrl.getInput();

        if(input.description !== "" && !isNaN(input.value) && input.value > 0) {
        newItem = budgetCtrl.addItem(input.type, input.description, input.value);
        
        UICtrl.addListItem(newItem, input.type);

        UICtrl.clearFileds();

        //calculate and update budget
        updateBudget();

        //Calculate and update the percentages
        updatePercentages();
        }
    }

    var ctrlDeleteItem = function(event) {
        var itemId, type, ID;

        itemId = event.target.parentNode.parentNode.parentNode.parentNode.id;

        if(itemId) {
            //inc-1
            splitId = itemId.split('-');
            type = splitId[0];
            ID = parseInt(splitId[1]);

            // 1. Delete items from datastructure
            budgetCtrl.deleteItem(type, ID);

            // 2. Delete items from UI
            UICtrl.deleteListItem(itemId);

            // 3. Update and show the new budget
            updateBudget();

            // 4. Calculate and update the percentages
            updatePercentages();
        }
    }

    return {
        init: function() {
            console.log('Application has started');
            UICtrl.displayMonth();
            UICtrl.displayBudget({
                budget: 0,
                totalInc: 0,
                totalExp : 0,
                percentage : 0
            });
            setupEventListener();
        }
    };

})(budgetController, UIController);

controller.init();