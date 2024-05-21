async function fetchTasks() {
    const response = await fetch('data/tasks.json');
    const data = await response.json();
    return data;
}

function displayTask(task, number, indent = "", level = 1) {
    let taskClass = level === 1 ? 'task' : 'subtask';
    let output = `${indent}${number} <span class="${taskClass}">${task.title}</span>\n`;
    output += `${indent}Priority: ${task.priority}\n`;
    output += `${indent}Completed: ${task.completed}\n`;
    if (task.subtasks && task.subtasks.length > 0) {
        task.subtasks.forEach((subtask, index) => {
            output += displayTask(subtask, `${number}.${index + 1}`, indent + "  ", level + 1);
        });
    }
    return output;
}

async function displayAllTasks() {
    const taskData = await fetchTasks();
    let globalCounter = 1;
    let output = '';
    if (taskData.global_tasks && taskData.global_tasks.length > 0) {
        taskData.global_tasks.forEach((globalTask, index) => {
            output += `${globalCounter}. <span class="global-task">Global Task: ${globalTask.title}</span>\n`;
            output += `Priority: ${globalTask.priority}\n`;
            output += `Completed: ${globalTask.completed}\n`;
            if (globalTask.tasks && globalTask.tasks.length > 0) {
                globalTask.tasks.forEach((task, index) => {
                    output += displayTask(task, `${globalCounter}.${index + 1}`, "  ");
                });
            }
            globalCounter++;
        });
    }
    return output;
}

document.addEventListener("DOMContentLoaded", async () => {
    const outputElement = document.getElementById("output");
    outputElement.innerHTML = await displayAllTasks();
});