//Budget controller
var budgetController = (function () {
  var Expenses = function (id, description, Value) {
    this.id = id;
    this.description = description;
    this.Value = Value;
    this.percentage = -1;
    this.month = 0;    
  };

  var income = function (id, description, Value) {
    this.id = id;
    this.description = description;
    this.Value = Value;
    this.month = 0;
  };


  var Data;
  if (localStorage.getItem('Data')) {
    Data = JSON.parse(localStorage.getItem('Data'));
  } else {
    Data = {
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
  }

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
      return newItem;
    },

    updateBudget: function (type, Value) {
      Data.allValue[type] = Data.allValue[type] + Value;
    },

    calcBudget: function () {
      Data.totalBudget = Data.allValue.inc - Data.allValue.exp;
    },

    updatepercentage: function () {
      if (Data.allValue.inc > Data.allValue.exp) {
        Data.percentage = (Data.allValue.exp / Data.allValue.inc) * 100;
      } else {
        Data.percentage = '--';
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

    calculateBudget: function (type) {
      var sum;
      sum = 0;
      Data.allItems[type].forEach((cur) => {
        sum += cur.Value;
      });
      Data.allValue[type] = sum;
    },

    ctrldelete: function (type, id) {
      var IDs, indexx;

      IDs = Data.allItems[type].map(function (el) {
        return el.id;
      });

      indexx = IDs.indexOf(id);

      if (indexx !== -1) {
        Data.allItems[type].splice(indexx, 1);
      }
    },

    expPercentages: function () {
      Data.allItems.exp.forEach((cur) => {
        if (Data.allValue.inc > Data.allValue.exp) {
          cur.percentage = (cur.Value / Data.allValue.inc) * 100;
        } else {
          cur.percentage = -1;
        }
      });
    },

    getPercentages: function () {
      var allPercs;
      allPercs = Data.allItems.exp.map((cur) => {
        return Math.round(cur.percentage);
      });
      return allPercs;
    },

    inputMonth: function(cur,month){
        cur.month = month
    },

    returnMonth: function(el){
      month = el.map((cur)=> cur.month)
      return month
    },

    pieChart: function () {
      document.querySelector('#myChart').remove();
      document
        .querySelector('#pie')
        .insertAdjacentHTML(
          'afterbegin',
          '<canvas id="myChart" width="400" height="400" aria-label="Pie chart of Icome and Expenses" role="img"></canvas>'
        );
      var pieChart = document.querySelector('#myChart');

      var myChart = new Chart(pieChart, {
        type: 'doughnut',
        data: {
          labels: ['Total Income', 'Total Expenses'],
          datasets: [
            {
              data: [Data.allValue.inc, Data.allValue.exp],
              backgroundColor: [
                'rgba(22, 112, 247, 1)',
                'rgba(255, 17, 17, 1)',
              ],
              borderWidth: 5,
              label: 'Budget',
            },
          ],
        },
        options: {
          animation: {
            duration: 2000,
            easing: 'easeInOutQuad',
          },
          responsive: true,
          maintainAspectRatio: false,
        },
      });
    },
    getData: function () {
      return Data;
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
    incomeDiv: '.incom',
    expensesDiv: '.expense',
    delete: '.incomenexpenses',
  };

  var nodelist = function (list, callback) {
    for (var i = 0; i < list.length; i++) {
      callback(list[i], i);
    }
  };

  var formatNumbers = function (obj, type) {
    var dec, beforeDec, afterDec, sign;
    var dec = Math.abs(obj);
    dec = dec.toFixed(2);
    splittedDec = dec.split('.');
    beforeDec = splittedDec[0];
    afterDec = splittedDec[1];

    if (beforeDec.length > 3) {
      beforeDec =
        beforeDec.substr(0, beforeDec.length - 3) +
        ',' +
        beforeDec.substr(beforeDec.length - 3, 3);
    } else if (beforeDec.length > 6) {
      beforeDec =
        beforeDec.substr(0, beforeDec.length - 6) +
        ',' +
        beforeDec.substr(beforeDec.length - 6, 3) +
        ',' +
        beforeDec.substr(before.length - 3, 3);
    }

    type === 'inc' ? (sign = '+') : (sign = '-');
    return sign + ' ' + beforeDec + '.' + afterDec;
  };

  return {
    getMonth: function () {
      var currentDate;
      currentDate = new Date();
      let todaysDate = {
        month: currentDate.getMonth(),
        Year: currentDate.getFullYear(),
        Day: currentDate.getDate(),
      };

      return todaysDate;      
    },

    displayMonth: function(month, Year){
      
      var months = [
        'January', //28
        'February',
        'March',
        'April', //30 3
        'May',
        'June', //30 5
        'July',
        'August',
        'September', //30 8
        'October',
        'November', //30 10
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
      newHtml = newHtml.replace('%amt%', formatNumbers(obj.Value, type));

      document.querySelector(el).insertAdjacentHTML('beforeend', newHtml);
    },

    displayBudget: function (obj) {
      document.querySelector(
        domStrings.incomeTotal
      ).textContent = formatNumbers(obj.totalinc, 'inc');
      document.querySelector(
        domStrings.expensesTotal
      ).textContent = formatNumbers(obj.totalexp, 'exp');

      if (obj.budget > 0) {
        type = 'inc';
        document.querySelector(
          domStrings.budgetTotal
        ).textContent = formatNumbers(obj.budget, type);
      } else {
        type = 'exp';
        document.querySelector(
          domStrings.budgetTotal
        ).textContent = formatNumbers(obj.budget, type);
      }

      if (obj.percentage > 0) {
        document.querySelector(domStrings.totalPercentage).textContent =
          Math.round(obj.percentage) + '%';
      } else {
        document.querySelector(domStrings.totalPercentage).textContent = '--';
      }
    },
    delete: function (ID) {
      var elemRemoved = document.getElementById(ID);

      //removes element completely from DOM
      elemRemoved.parentNode.removeChild(elemRemoved);
    },

    displayPercentages: function (percents) {
      var percsDiv = document.querySelectorAll('.per_cent');

      nodelist(percsDiv, function (current, index) {
        if (percents[index] > 0) {
          current.textContent = percents[index] + '%';
        } else {
          current.textContent = '--';
        }
      });
    },
    onChange: function () {
      document.querySelector(domStrings.type).addEventListener('change', () => {
        document.querySelector(domStrings.ok).classList.toggle('red');
        var changes = document.querySelectorAll(
          domStrings.Value + ',' + domStrings.desc + ',' + domStrings.type
        );
        changes.forEach((cur) => {
          cur.classList.toggle('redexp');
        });
      });
    },
  };
})();

//App controller
var appController = (function (uiCtrl, budgetCtrl) {
  var input, domStrings, Item, eachPercent, ctx;

  let getDate = uiCtrl.getMonth()
  var Budgetit = function () {
    var budgetUpdate;

    //update pecentage
    budgetCtrl.updatepercentage();

    budgetUpdate = budgetCtrl.getBudget();

    //display budget
    uiCtrl.displayBudget(budgetUpdate);

    //calculate percentages
    budgetCtrl.expPercentages();

    //get percentages
    eachPercent = budgetCtrl.getPercentages();

    //display in UI
    uiCtrl.displayPercentages(eachPercent);
  };

  var addItem = function () {
    var percentages;

    //get input
    input = uiCtrl.getInput();

    if ((input.Value > 0) & (input.desc !== '') & (input !== isNaN)) {
      //create new item
      Item = budgetCtrl.createItem(input.Type, input.desc, input.Value);
      

      budgetCtrl.inputMonth(Item,getDate.month);

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
      budgetCtrl.pieChart();

      //local Storage
      localStorage.setItem('Data', JSON.stringify(budgetCtrl.getData()));
    }
  };

  var deleteItem = function () {
    var item, itemtype, itemId;

    item = event.target.parentNode.parentNode.parentNode.parentNode.id;
    itemsplitted = item.split('-');
    itemtype = itemsplitted[0];
    itemId = parseInt(itemsplitted[1]);

    budgetCtrl.ctrldelete(itemtype, itemId);

    budgetCtrl.calculateBudget(itemtype);

    //delete from ui
    uiCtrl.delete(item);

    //update budget
    budgetCtrl.calcBudget();
    Budgetit();

    //chart
    budgetCtrl.pieChart();

    //local Storage
    localStorage.setItem('Data', JSON.stringify(budgetCtrl.getData()));
  };

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

    document
      .querySelector(domStrings.delete)
      .addEventListener('click', deleteItem);

    //display date
    uiCtrl.displayMonth(getDate.month, getDate.Year);



    //load stored data if any
    if (localStorage.getItem('Data') !== null) {
      let storedData = JSON.parse(localStorage.getItem('Data'));
      
      let entryMonthinc = budgetCtrl.returnMonth(storedData.allItems.inc)

      let entryMonthexp = budgetCtrl.returnMonth(storedData.allItems.exp)

      if((getDate.month - entryMonthexp[entryMonthexp.length - 1] > 0 || getDate.month -  entryMonthinc[entryMonthinc.length - 1] > 0)){
        localStorage.clear()
      }

      if (localStorage.getItem('Data') !== null){
        let Data = JSON.parse(localStorage.getItem('Data'));

      uiCtrl.displayBudget({
        totalinc: Data.allValue.inc,
        totalexp: Data.allValue.exp,
        budget: Data.totalBudget,
        percentage: Data.percentage,
      });

      //display localStorage data
      Data.allItems.inc.forEach((cur) => {
        uiCtrl.displayItem(cur, 'inc');
      });
      Data.allItems.exp.forEach((cur) => {
        uiCtrl.displayItem(cur, 'exp');
      });

      Budgetit();

      //Chart
      budgetCtrl.pieChart();
      }
      
    } else {
      uiCtrl.displayBudget({
        totalinc: 0,
        totalexp: 0,
        budget: 0,
        percentage: 0,
      });
    }

    //local Storage
  });
})(uiController, budgetController);

init();

/**************************Register Service worker********************/
if('serviceWorker' in navigator){
  navigator.serviceWorker.register('sw.js')
}
