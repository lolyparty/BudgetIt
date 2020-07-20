//Budget controller
var budgetController = (function () {
  var Expenses = function (id, description, Value) {
    this.id = id;
    this.description = description;
    this.Value = Value;
    this.percentage = -1
  };

  var income = function (id, description, Value) {
    this.id = id;
    this.description = description;
    this.Value = Value;
  };

  Expenses.prototype.calcpercent = function(){
    if(Data.allValue.inc > 0){
      this.percentage = this.Value/Data.allValue.inc * 100
    }
    else{
      this.percentage = '-1'
    }
  }

  Expenses.prototype.getPercent = function(){
    return this.percentage
  }



  // var John = new income('John', 'Money', 1000);
  // console.log(John)

  var Data = {
    allItems: {
      inc: [],
      exp: [],
    },
    allValue: {
      inc: 0,
      exp: 0,
    },
    totalBudget: 0,
    percentage: -1,
  };

  return {
    createItem: function (type, desc, Value) {
      var newItem, ID;

      //ID = lastid + 1
      if (Data.allItems[type].length > 0) {
        ID = Data.allItems[type][Data.allItems[type].length - 1].id + 1;
      } else {
        ID = 0;
      }

      if (type === 'inc') {
        newItem = new income(ID, desc, Value);
      } else if (type === 'exp') {
        newItem = new Expenses(ID, desc, Value);
      }

      Data.allItems[type].push(newItem);
      // console.log(newItem)
      return newItem;
    },

    updateBudget: function (type, Value) {

        Data.allValue[type] = Data.allValue[type] + Value;
      
    },

    calcBudget:function(){
      Data.totalBudget = Data.allValue.inc - Data.allValue.exp;
    },

    updatepercentage: function () {
      if(Data.allValue.inc > Data.allValue.exp){
        Data.percentage = (Data.allValue.exp / Data.allValue.inc) * 100;
      }else{
        Data.percentage = '--'
      }
    },

    getBudget: function () {
      return {
        totalinc: Data.allValue.inc,
        totalexp: Data.allValue.exp,
        budget: Data.totalBudget,
        percentage: Data.percentage,
      };
    },

    calculateBudget: function(type){
      var sum
      sum = 0;
        Data.allItems[type].forEach((cur) => {
          sum += cur.Value
        })
          Data.allValue[type] = sum
          // console.log(Data.allValue.inc)
    },


    ctrldelete: function(type, id){
      var IDs,indexx

      IDs = Data.allItems[type].map(function(el){
        // console.log(el.id)
        return el.id
      })

      indexx = IDs.indexOf(id)
      // console.log(indexx)

      if(indexx !== -1){
        Data.allItems[type].splice(indexx,1)
      }

      // console.log(Data.allItems[type]);
    },

    ExpPercentages: function(newObj){
      newObj.forEach(newObj.calcpercent())
      newObj.getPercent()
    },


  };
})();

//UI controller
var uiController = (function () {
  var domStrings = {
    type: '.inc_or_dec',
    desc: '.descriptioninput',
    Value: '.value',
    ok: '.addbtn',
    Month: '.month',
    budgetTotal: '#budgettotal',
    incomeTotal: '.incometotalamt',
    expensesTotal: '.expensestotalamt',
    totalPercentage: '#totalpercent',
    incomeDiv: '.income',
    expensesDiv: '.expenses',
    delete:'.incomenexpenses',
  };

  return {
    displayMonth: function () {
      var currentDate, month, Year, currentMonth;
      currentDate = new Date();
      month = currentDate.getMonth();
      Year = currentDate.getFullYear();

      var months = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
      ];
      currentMonth = months[month];
      document.querySelector(domStrings.Month).textContent =
        currentMonth + ', ' + Year;
    },

    getDom: function () {
      return domStrings;
    },

    getInput: function () {
      return {
        Type: document.querySelector(domStrings.type).value,
        desc: document.querySelector(domStrings.desc).value,
        Value: parseFloat(document.querySelector(domStrings.Value).value),
      };
    },

    clearFields: function () {
      var fields, newFields;
      fields = document.querySelectorAll(
        domStrings.desc + ',' + domStrings.Value
      );
      newFields = Array.prototype.slice.call(fields);
      newFields.forEach(function (current, index) {
        current.value = '';
      });
      newFields[0].focus();
    },

    displayItem: function (obj, type) {
      var Html, newHtml, el;

      if (type === 'inc') {
        Html =
          '<div class="list clearfix" id="inc-%id%"><div class="desc">%desc%</div><div class="right clearfix"><div class="amt blue">%amt%</div><div class="delete"><button class="x-icon blue"><i class="ion-ios-close-outline"></i></button></div><div></div>';

        el = domStrings.incomeDiv;
      } else if (type === 'exp') {
        Html =
          '<div class="list clearfix" id="exp-%id%"><div class="desc">%desc%</div><div class="right clearfix"><div class="amt  red">%amt%</div><div class="per_cent">100%</div><div class="delete"><button class="x-icon red"><i class="ion-ios-close-outline"></i></button></div></div></div>';

        el = domStrings.expensesDiv;
      }

      newHtml = Html.replace('%id%', obj.id);
      newHtml = newHtml.replace('%desc%', obj.description);
      newHtml = newHtml.replace('%amt%', obj.Value);

      document.querySelector(el).insertAdjacentHTML('beforeend', newHtml);
    },

    displayBudget: function (obj) {
      document.querySelector(domStrings.incomeTotal).textContent =
        '+ ' + obj.totalinc;
      document.querySelector(domStrings.expensesTotal).textContent =
        '- ' + obj.totalexp;

      document.querySelector(domStrings.budgetTotal).textContent = obj.budget;

      if (obj.percentage > 0) {
        document.querySelector(domStrings.totalPercentage).textContent =
          Math.round(obj.percentage) + '%';
      } else {
        document.querySelector(domStrings.totalPercentage).textContent = '--';
      }
    },
    delete:function(ID){
      // console.log(ID)
      document.getElementById(ID).classList.add('remove');
      document.getElementById(ID).style.display = 'none';

    }
  };
})();

//App controller
var appController = (function (uiCtrl, budgetCtrl) {
  var input, domStrings, Item 

  var Budgetit = function(){
    var budgetUpdate
    //update pecentage
    budgetCtrl.updatepercentage();

    budgetUpdate = budgetCtrl.getBudget();
    // console.log(budgetUpdate);

    //display budget
    uiCtrl.displayBudget(budgetUpdate);
  }

  var addItem = function () {
    var percentages

    //get input
    input = uiCtrl.getInput();

    if ((input.Value > 0) & (input.desc !== '') & (input !== isNaN)) {
      //create new item
      Item = budgetCtrl.createItem(input.Type, input.desc, input.Value);
      // console.log(Item);

      //clear
      uiCtrl.clearFields();

      //display item in UI
      uiCtrl.displayItem(Item, input.Type);

      //update budget
      budgetCtrl.updateBudget(input.Type, input.Value);
      budgetCtrl.calcBudget();

      Budgetit();

      percentages = budgetCtrl.ExpPercentages(Item);
      console.log(percentages)
    }
  };

  var deleteItem = function(){
    var item, itemtype, itemId

      item = event.target.parentNode.parentNode.parentNode.parentNode.id
      itemsplitted = item.split('-');
      itemtype = itemsplitted[0]
      itemId = parseInt(itemsplitted[1])
      // console.log(itemtype);    

      //delete item from bdudget
      // console.log(itemId)
    budgetCtrl.ctrldelete(itemtype,itemId);

    budgetCtrl.calculateBudget(itemtype)


    //update budget
    budgetCtrl.calcBudget();
    Budgetit();

    //delete from ui
    uiCtrl.delete(item)
  }

  return (init = function () {
    domStrings = uiCtrl.getDom();

    //click to add new
    document.querySelector(domStrings.ok).addEventListener('click', addItem);

    document.addEventListener('keypress', () => {
      if (event.keyCode === 13 || event.which === 13) {
        addItem();
      }
    });
     
    document.querySelector(domStrings.delete).addEventListener('click', deleteItem);

    //display date
    uiCtrl.displayMonth();

    var bdget = budgetCtrl.getBudget({});

    // console.log(bdget);

    uiCtrl.displayBudget({
      totalinc: 0,
      totalexp: 0,
      budget: 0,
      percentage: 0,
    });

    
    
  });
})(uiController, budgetController);

init();
