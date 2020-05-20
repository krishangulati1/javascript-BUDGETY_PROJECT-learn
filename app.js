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

    var domString = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue:'.add__value',
        inputBtn: '.add__btn'
    };

    return {
        getInput : function() {
            return {type : document.querySelector(domString.inputType).value,
            description : document.querySelector(domString.inputDescription).value,
            value : document.querySelector(domString.inputValue).value
            }
        },
        getDomStrings: function() {
            return domString;
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
        console.log(input);
    }

    return {
        init: function() {
            console.log('Application has started');
            setupEventListener();
        }
    };

})(budgetController, UIController);

controller.init();