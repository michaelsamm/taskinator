var pageContentE1 = document.querySelector("#page-content");
var taskIdCounter = 0;
var formE1 = document.querySelector("#task-form");
var tasksToDoE1 = document.querySelector("#tasks-to-do");
var tasksInProgressE1 = document.querySelector("#tasks-in-progress");
var tasksCompletedE1 = document.querySelector("#tasks-completed");

var tasks = [];

// Create a new task when the form is submitted
var taskFormHandler = function(event) {
    
    event.preventDefault();
    var taskNameInput = document.querySelector("input[name='task-name']").value;
    var taskTypeInput = document.querySelector("select[name='task-type']").value;

    // check if editing existing task by checking for data-task-id
    var isEdit = formE1.hasAttribute("data-task-id");

    // VALIDATION check if input values are empty strings
    if (!taskNameInput || !taskTypeInput) {
        alert("You need to fill out the task form!");
        return false;
    }

    // reset form to initial state
    formE1.reset();

    // if edit, call function to update task
    if (isEdit) {
        var taskId = formE1.getAttribute("data-task-id");
        completeEditTask(taskNameInput, taskTypeInput, taskId);
    }
    // if new, send it as an argument to createTaskE1
    else {
        // package up data as an object
        var taskDataObj = {
            name: taskNameInput,
            type: taskTypeInput,
            status: "to do"
        };
        createTaskE1(taskDataObj); 
    } 
};

// Insert the form results into the new task
var createTaskE1 = function(taskDataObj) {
    // create list item
    var listItemE1 = document.createElement("li");
    listItemE1.className = "task-item";

    // TASKID add task id as a custom attribute
    listItemE1.setAttribute("data-task-id", taskIdCounter);

    // create div to hold task info and add to list item
    var taskInfoE1 = document.createElement("div");
    taskInfoE1.className = "task-info";

    // add html content to the div
    taskInfoE1.innerHTML = "<h3 class = 'task-name'>" + taskDataObj.name +"</h3><span class ='task-type'>" + taskDataObj.type + "</span>";

    // add div to li
    listItemE1.appendChild(taskInfoE1);

    // Add taskId to the taskDataObj
    taskDataObj.id = taskIdCounter;

    // Add taskDataObj for new task to the tasks array
    tasks.push(taskDataObj);
    
    // update localStorage tasks array
    saveTasks();

    var taskActionsE1 = createTaskActions(taskIdCounter);
    listItemE1.appendChild(taskActionsE1);
    
    // add entire list item to list
    tasksToDoE1.appendChild(listItemE1);

    // TASKID increase task counter for next unique id
    taskIdCounter++;
}

// Add actions to each created task
var createTaskActions = function(taskId) {
    var actionContainerE1 = document.createElement("div");
    actionContainerE1.className = "task-actions";

    // create EDIT button
    var editButtonE1 = document.createElement("button");
    editButtonE1.textContent = "Edit";
    editButtonE1.className = "btn edit-btn";
    editButtonE1.setAttribute("data-task-id", taskId);

    actionContainerE1.appendChild(editButtonE1);

    // create DELETE button
    var deleteButtonE1 = document.createElement("button");
    deleteButtonE1.textContent = "Delete";
    deleteButtonE1.className = "btn delete-btn";
    deleteButtonE1.setAttribute("data-task-id", taskId);

    actionContainerE1.appendChild(deleteButtonE1);

    // Add STATUS selector dropdown
    var statusSelectE1 = document.createElement("select");
    statusSelectE1.className = "select-status";
    statusSelectE1.setAttribute("name", "status-change");
    statusSelectE1.setAttribute("data-task-id", taskId);

    // Add STATUS OPTIONS as a loop of an array to add each option
    var statusChoices = ["To Do", "In Progress", "Completed"];
    for (var i = 0; i < statusChoices.length; i++) {
        // create option element
        var statusOptionE1 = document.createElement("option");
        statusOptionE1.textContent = statusChoices[i];
        statusOptionE1.setAttribute("value", statusChoices[i]);

        // append to select
        statusSelectE1.appendChild(statusOptionE1);
    }

    actionContainerE1.appendChild(statusSelectE1);

    return actionContainerE1;
}





// find correct task when delete/edit is clicked
var taskButtonHandler = function(event) {
    // get target element from event
    var targetE1 = event.target;

    // if element is edit button
    if(targetE1.matches(".edit-btn")) {
        var taskId = targetE1.getAttribute("data-task-id");
        editTask(taskId);
    }

    // if element is delete button
    else if (targetE1.matches(".delete-btn")) {
        // get element's task id
        var taskId = event.target.getAttribute("data-task-id");
        deleteTask(taskId);
    }
}

// edit task - repopulate form
var editTask = function(taskId) {
    // get task list item
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");
    // get content from task name and type
    var taskName = taskSelected.querySelector("h3.task-name").textContent;
    var taskType = taskSelected.querySelector("span.task-type").textContent;
    // set taskName and taskType in form
    document.querySelector("input[name='task-name']").value = taskName;
    document.querySelector("select[name='task-type']").value = taskType;
    // change submit button label
    document.querySelector("#save-task").textContent = "Save Task";
    // pass back in active task id
    formE1.setAttribute("data-task-id", taskId);
}

var completeEditTask = function(taskName, taskType, taskId) {
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");

    // set new values
    taskSelected.querySelector("h3.task-name").textContent = taskName;
    taskSelected.querySelector("span.task-type").textContent = taskType;

    // loop through tasks array and update with new content
    for (var i = 0; i < tasks.length; i++) {
        if (tasks[i].id === parseInt(taskId)) {
            tasks[i].name = taskName;
            tasks[i].type = taskType;
        }
    }

    // update localStorage array
    saveTasks();

    alert("Task Updated!");

    formE1.removeAttribute("data-task-id");
    document.querySelector("#save-task").textContent = "Add Task";
}

// delete task
var deleteTask = function(taskId) {
    // get task list item
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");
    taskSelected.remove();

    // create new array to hold updated list of tasks
    var updatedTaskArr = [];

    // loop through current tasks
    for (var i = 0; i < tasks.length; i++) {
        // if tasks[i].id doesn't match the value of taskId, keep the task and push into new array
        if (tasks[i].id !== parseInt(taskId)) {
            updatedTaskArr.push(tasks[i]);
        }
    }
    // reassign tasks array to be the same as updatedTaskArr
    tasks = updatedTaskArr;

    // update localStorage tasks array
    saveTasks();
}

var taskStatusChangeHandler = function(event) {
    // get task list item
    var taskId = event.target.getAttribute("data-task-id");

    // get the currently selected option's value and convert to lowercase
    var statusValue = event.target.value.toLowerCase();

    // find the parent task item element based on the id
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");

    if (statusValue === "to do") {
        tasksToDoE1.appendChild(taskSelected);
    }
    else if (statusValue === "in progress") {
        tasksInProgressE1.appendChild(taskSelected);
    }
    else if (statusValue === "completed") {
        tasksCompletedE1.appendChild(taskSelected);
    }

    // update tasks in tasks array
    for (var i = 0; i < tasks.length; i++) {
        if (tasks[i].id === parseInt(taskId)) {
            tasks[i].status = statusValue;
        }
    }

    // update localStorage tasks array
    saveTasks();
}

var saveTasks = function() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

var loadTasks = function() {
    // get task items from localStorage
    var tasks = localStorage.getItem("tasks");

    if (!tasks) {
        tasks = [];
        return false;
    }

    // convert tasks from the string back into an array of objects
    tasks = JSON.parse(tasks);

    // iterates through a tasks array and creates task elements from it
    for (i = 0; i < tasks.length; i++) {
        taskIdCounter = tasks[i].id;
        var listItemE1 = document.createElement("li");
        listItemE1.className = "task-item";
        listItemE1.setAttribute("data-task-id", taskIdCounter);

        var taskInfoE1 = document.createElement("div");
        taskInfoE1.className = "task-info";
        taskInfoE1.innerHTML = "<h3 class = 'task-name'>" + tasks[i].name +"</h3><span class ='task-type'>" + tasks[i].type + "</span>";

        listItemE1.appendChild(taskInfoE1);

        var taskActionsE1 = createTaskActions(tasks[i].id)

        listItemE1.appendChild(taskActionsE1);

        if (tasks[i].status === "to do") {
            listItemE1.querySelector("select[name='status-change']").selectedIndex = "0";
            tasksToDoE1.appendChild(listItemE1);
        }
        else if (tasks[i].status === "in progress") {
            listItemE1.querySelector("select[name='status-change']").selectedIndex = "1";
            tasksInProgressE1.appendChild(listItemE1);           
        }
        else if (tasks[i].status === "completed") {
            listItemE1.querySelector("select[name='status-change']").selectedIndex = "2";
            tasksCompletedE1.appendChild(listItemE1);           
        }

        taskIdCounter++;
    }
}

formE1.addEventListener("submit", taskFormHandler);

pageContentE1.addEventListener("click", taskButtonHandler);

pageContentE1.addEventListener("change", taskStatusChangeHandler);

loadTasks();
