//budgetController module
var budgetController = (function() {
    //Some Code
    var Expense = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    }

    var Income = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    }

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
        container: '.container'
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
            newHtml = newHtml.replace('%value%',obj.value);
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
            document.querySelector(domStrings.budgetLabel).textContent = obj.budget;
            document.querySelector(domStrings.incomeLabel).textContent = obj.totalInc;
            document.querySelector(domStrings.expensesLabel).textContent = obj.totalExp;
            
            if (obj.percentage > 0 ) {
                document.querySelector(domStrings.percentageLabel).textContent = obj.percentage;
            }
            else {
                document.querySelector(domStrings.percentageLabel).textContent = '---';
            }
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
    }

    var updateBudget = function() {
        //1. Caculate the budget
        budgetCtrl.calculateBudget();

        //2. Return the budget
        var budget = budgetCtrl.getBudget();

        //3. display the budget on the UI
        UICtrl.displayBudget(budget);

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
        }
    }

    return {
        init: function() {
            console.log('Application has started');
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