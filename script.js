const ctx = document.getElementById('expenseChart').getContext('2d');
let expenseChart = new Chart(ctx, {
  type: 'line',
  data: {
    labels: [],
    datasets: [{
      label: 'Expenses (₹)',
      data: [],
      backgroundColor: 'rgba(255, 99, 132, 0.2)',
      borderColor: 'rgba(255, 99, 132, 1)',
      borderWidth: 2,
      tension: 0.4,
    }]
  },
  options: {
    scales: {
      y: {
        beginAtZero: true
      }
    },
    responsive: true,
    maintainAspectRatio: false,
  }
});
let expenses = [];
let totalExpenses = 0;
let lastAction = null; 
const expenseForm = document.getElementById('expenseForm');
const expenseName = document.getElementById('expenseName');
const expenseAmount = document.getElementById('expenseAmount');
const expenseCategory = document.getElementById('expenseCategory');
const expenseMonth = document.getElementById('expenseMonth');
const totalExpensesDisplay = document.getElementById('totalExpenses');
const expenseList = document.getElementById('expenseList');
expenseForm.addEventListener('submit', (e) => {
  e.preventDefault();
  addExpense();
});
function addExpense() {
  const name = expenseName.value.trim();
  const amount = parseFloat(expenseAmount.value);
  const category = expenseCategory.value;
  const month = expenseMonth.value;

  if (name && amount && category && month) {
    const expense = { name, amount, category, month };
    expenses.push(expense);
    lastAction = { type: 'add', expense }; 
    updateUI();
    updateChart();
    clearForm();
  } else {
    alert("Please fill all fields!");
  }
}
function clearForm() {
  expenseForm.reset();
}

function saveExpense() {
  const name = expenseName.value.trim();
  const amount = parseFloat(expenseAmount.value);
  const category = expenseCategory.value;
  const month = expenseMonth.value;

  if (name && amount && category && month) {
    alert("Expense saved temporarily. Click 'Add Expense' to confirm.");
  } else {
    alert("Please fill all fields!");
  }
}
function undoLastAction() {
  if (!lastAction) {
    alert("No action to undo!");
    return;
  }

  if (lastAction.type === 'add') {
    
    expenses.pop();
  } else if (lastAction.type === 'delete') {
    
    expenses.push(lastAction.expense);
  }
  updateUI();
  updateChart();
  lastAction = null; 
}
function updateUI() {
  totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  totalExpensesDisplay.textContent = totalExpenses.toFixed(2);

  expenseList.innerHTML = '';
  expenses.forEach((expense, index) => {
    const li = document.createElement('li');
    li.innerHTML = `
      <span>${expense.name} - ₹${expense.amount.toFixed(2)} (${expense.category}, ${expense.month})</span>
      <button class="deleteBtn" onclick="deleteExpense(${index})">Delete</button>
    `;
    expenseList.appendChild(li);
  });
}
function deleteExpense(index) {
  const deletedExpense = expenses.splice(index, 1)[0];
  lastAction = { type: 'delete', expense: deletedExpense }; // Track the last action
  updateUI();
  updateChart();
}
function updateChart() {
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  const monthlyExpenses = months.map(month => {
    return expenses
      .filter(expense => expense.month === month)
      .reduce((sum, expense) => sum + expense.amount, 0);
  });
  expenseChart.data.labels = months;
  expenseChart.data.datasets[0].data = monthlyExpenses;
  expenseChart.update();
}
window.onload = function () {
  setTimeout(() => {
      document.getElementById("preloader").style.display = "none";
  }, 1000); 
};
