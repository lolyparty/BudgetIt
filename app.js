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

  Expenses.prototype.calcpercent = function(totalIncome){
    if(totalIncome > 0){
      this.percentage = this.Value/totalIncome * 100
    }
    else{
      this.percentage = '-1'
    }
  }

  Expenses.prototype.getPercent = function(){
    return this.percentage;
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

        // console.log(Data.allValue[type])
      
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
          // console.log(Data.allValue[type])
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

    expPercentages: function(){
      Data.allItems.exp.forEach((cur)=>{
        cur.calcpercent(Data.allValue.inc);
      })
      // console.log(Data.allItems.exp);
      // console.log(Data.allItems.inc)
    },

    getPercentages: function(){
      var allPercs
       allPercs = Data.allItems.exp.map((cur)=>{
         return Math.round(cur.getPercent());
      })
      // console.log(allPercs);
      return allPercs;
    },

    pieChart: function(){
      document.querySelector('#myChart').remove();
       document.querySelector('#pie').insertAdjacentHTML('afterbegin','<canvas id="myChart" width="400" height="400" aria-label="Pie chart of Icome and Expenses" role="img"></canvas>');
       var pieChart = document.querySelector('#myChart');

        var myChart = new Chart(pieChart, 
          {
            type:'doughnut',
            data:{
              labels: ['Total Income', 'Total Expenses'],
              datasets:[{
                data: [Data.allValue.inc, Data.allValue.exp],
                backgroundColor: ['rgba(22, 112, 247, 1)','rgba(255, 17, 17, 1)'],
                borderWidth: 5,
                label: 'Budget',
              }],
            },
            options:{  
              animation:{
                duration: 2000,
                easing:'easeInOutQuad',
              },
              responsive:true,
              maintainAspectRatio:false,
            },
          })
    }
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
    incomeDiv: '.incom',
    expensesDiv: '.expense',
    delete:'.incomenexpenses',
  };

  var nodelist = function(list, callback){
    for (var i = 0; i < list.length; i++){
      callback(list[i], i);
    };
  };

  var formatNumbers = function(obj, type){
    var dec, beforeDec, afterDec, sign
    var dec = Math.abs(obj)
    dec = dec.toFixed(2);
    splittedDec = dec.split('.');
    beforeDec = splittedDec[0];
    afterDec = splittedDec[1];

    if(beforeDec.length > 3){
      beforeDec = beforeDec.substr(0,beforeDec.length - 3) + ',' + beforeDec.substr(beforeDec.length - 3, 3)
    }
    else if(beforeDec.length > 6){
      beforeDec = beforeDec.substr(0, beforeDec.length -6) + ',' + beforeDec.substr(beforeDec.length - 6, 3) + ',' + beforeDec.substr(before.length - 3, 3);
    }

    type === 'inc' ? sign = '+' : sign = '-';
    return sign + ' ' + beforeDec + '.' + afterDec;
  }

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
      newHtml = newHtml.replace('%amt%', formatNumbers(obj.Value,type));

      document.querySelector(el).insertAdjacentHTML('beforeend', newHtml);
    },

    displayBudget: function (obj) {
      document.querySelector(domStrings.incomeTotal).textContent =
        formatNumbers(obj.totalinc, 'inc');
      document.querySelector(domStrings.expensesTotal).textContent =
        formatNumbers(obj.totalexp, 'exp');

        if(obj.budget > 0){
          type = 'inc'
          document.querySelector(domStrings.budgetTotal).textContent = formatNumbers(obj.budget, type);
        }
        else{
          type = 'exp'
          document.querySelector(domStrings.budgetTotal).textContent = formatNumbers(obj.budget, type);
        }

      if (obj.percentage > 0) {
        document.querySelector(domStrings.totalPercentage).textContent =
          Math.round(obj.percentage) + '%';
      } else {
        document.querySelector(domStrings.totalPercentage).textContent = '--';
      }
    },
    delete:function(ID){
      // console.log(ID)
      var elemRemoved = document.getElementById(ID);

      //removes element completely from DOM
      elemRemoved.parentNode.removeChild(elemRemoved);
    },

    displayPercentages: function(percents){
      var percsDiv = document.querySelectorAll('.per_cent');
      console.log(percsDiv);

      nodelist(percsDiv, function(current, index){
        if(percents[index] > 0){
          current.textContent = percents[index] + '%'
        } else{
          current.textContent = '--';
        }
        
      });
  },
  onChange: function(){
    document.querySelector(domStrings.type).addEventListener('change',()=>{
      document.querySelector(domStrings.ok).classList.toggle('red');
      var changes = document.querySelectorAll(domStrings.Value + ',' + domStrings.desc + ',' + domStrings.type);
        changes.forEach( (cur)=> {
          cur.classList.toggle('redexp')
        }
          
          )
    })
    },
    // displayChart: function(){
    //   var myChart = document.querySelector('#myChart').getContext('2d');
    //   return myChart
    // }
  
  
  }
})();

//App controller
var appController = (function (uiCtrl, budgetCtrl) {
  var input, domStrings, Item, eachPercent, ctx 

  // ctx = uiCtrl.displayChart();

  var Budgetit = function(){
    var budgetUpdate
    //update pecentage
    budgetCtrl.updatepercentage();

    budgetUpdate = budgetCtrl.getBudget();
    // console.log(budgetUpdate);

    //display budget
    uiCtrl.displayBudget(budgetUpdate);

     //calculate percentages
     budgetCtrl.expPercentages();
    

     //get percentages
     eachPercent = budgetCtrl.getPercentages();
     console.log(eachPercent)

     //display in UI
    uiCtrl.displayPercentages(eachPercent);
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

      //display budget
      Budgetit();

     //chart
    //  console.log(ctx);
     budgetCtrl.pieChart();
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
      // console.log(itemtype)
    budgetCtrl.ctrldelete(itemtype,itemId);

    budgetCtrl.calculateBudget(itemtype)

    //delete from ui
    uiCtrl.delete(item)

    //update budget
    budgetCtrl.calcBudget();
    Budgetit();

    //chart
    budgetCtrl.pieChart();
     
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
     
    uiCtrl.onChange();

    document.querySelector(domStrings.delete).addEventListener('click', deleteItem);

    //display date
    uiCtrl.displayMonth();

    // var bdget = budgetCtrl.getBudget({});

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
