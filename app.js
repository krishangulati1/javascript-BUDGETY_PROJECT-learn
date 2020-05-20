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

    var data = {
        allItems: {
            exp: [],
            inc:[]
        },
        totals: {
            exp: 0,
            inc:0
        }
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
        expensesContainer: '.expenses__list'
    };

    return {
        getInput : function() {
            return {
                type : document.querySelector(domStrings.inputType).value,
                description : document.querySelector(domStrings.inputDescription).value,
                value : document.querySelector(domStrings.inputValue).value
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
    }

    var ctrlAddItem = function () {
        var input = UICtrl.getInput();

        var newItem = budgetCtrl.addItem(input.type, input.description, input.value);
        
        UICtrl.addListItem(newItem, input.type);
    }

    return {
        init: function() {
            console.log('Application has started');
            setupEventListener();
        }
    };

})(budgetController, UIController);

controller.init();