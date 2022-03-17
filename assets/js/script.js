var taskIdCounter = 0;
var formE1 = document.querySelector("#task-form");
var tasksToDoE1 = document.querySelector("#tasks-to-do");

var taskFormHandler = function(event) {
    
    event.preventDefault();
    var taskNameInput = document.querySelector("input[name='task-name']").value;
    var taskTypeInput = document.querySelector("select[name='task-type']").value;
    
    // package up data as an object
    var taskDataObj = {
        name: taskNameInput,
        type: taskTypeInput
    };

    // VALIDATION check if input values are empty strings
    if (!taskNameInput || !taskTypeInput) {
        alert("You need to fill out the task form!");
        return false;
    }

    // reset form to initial state
    formE1.reset();

    // send it as an argument to createTaskE1
    createTaskE1(taskDataObj);
};

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

    var taskActionsE1 = createTaskActions(taskIdCounter);
    listItemE1.appendChild(taskActionsE1);
    
    // add entire list item to list
    tasksToDoE1.appendChild(listItemE1);

    // TASKID increase task counter for next unique id
    taskIdCounter++;
}

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

formE1.addEventListener("submit", taskFormHandler);

