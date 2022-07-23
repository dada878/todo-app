// const electron = require('electron');
// const {ipcRenderer} = electron;

// function callScript() {
//     ipcRenderer.send("notification");
// }

// import 'electron';

var vu = Vue.createApp({
    data() {
        return {
            list: [],
        }
    }
}).mount('#app');

$("#btn").on("click", () => {
    open_form();
});

$("#create").on("click", () => {
    vu.list.push({
        name: $("#task-name").val(),
        type: Number($("#task-type").val()),
        finish: false
    });
    sort_list();
    save_data();
    close_form();
    setTimeout(() => {
        init_input_callback();
    }, 1);
});

var delete_value_check = false;

$("#cancel").on("click", () => {
    close_form();
});

$("#cancel-alert").on("click", () => {
    close_alert();
});

$("#ok-alert").on("click", () => {
    delete_value_check = true;
    close_alert();
});

$('#deleteAlert').on('click', function (e) {
    if (e.target !== this) return;
    close_alert();
});

$('#form').on('click', function (e) {
    if (e.target !== this) return;
    close_form();
});

$("#task-name").on("keyup", (e) => {
    if (e.key === "Enter") {
        $("#create").trigger("click");
    }
});

function init_input_callback() {
    let inputs = $(".task-checkbox");
    for (let i of inputs) {
        const ele = $(i);
        ele.off("change");
    }
    for (let i = 0; i < inputs.length; i++) {
        const ele = $(inputs[i]);
        ele.on("change", () => {
            vu.list[i].finish = ele.is(":checked");
            save_data();
        });
    }
    let taskItems = $(".taskItem");
    for (let i of taskItems) {
        const ele = $(i);
        ele.off("click");
    }
    for (let i = 0; i < taskItems.length; i++) {
        const ele = $(taskItems[i]);
        const childrenEle = ele.children("input");
        ele.on("click", (e) => {
            if (e.target !== ele[0] && $(e.target).prop("tagName") != "P") return;
            let state = childrenEle.is(":checked");
            vu.list[i].finish = !state;
            childrenEle.prop("checked", !state);
            save_data();
        });
        const removeButton = ele.children(".remove-button");
        removeButton.off("click");
        removeButton.on("click", () => {
            open_alert();
            delete_target = i;
        });
    }
}

function show_toast() {
    $('.toast').toast('show');
}

function open_form() {
    $("#task-name").val("");
    $("#form").show();
    $("#form").addClass("addTask-display");
    $("#task-name").trigger("focus");
}

function close_form() {
    $("#form").removeClass("addTask-display");
    setTimeout(() => {
        $("#form").hide();
    }, 200);
}

function open_alert() {
    $("#deleteAlert").show();
    $("#deleteAlert").addClass("addTask-display");
}

var delete_target;
function close_alert() {
    $("#deleteAlert").removeClass("addTask-display");
    setTimeout(() => {
        $("#deleteAlert").hide();
    }, 200);
    if (delete_value_check) {
        vu.list = vu.list.filter(item => item != vu.list[delete_target]);
        setTimeout(() => {
            init_input_callback();
            save_data();
            load_data();
        }, 1);
        delete_value_check = false;
    }
}

function remove_item(index) {
    vu.list = vu.list.filter(item => item != vu.list[index]);
}

function save_data() {
    localStorage.setItem("tasks", JSON.stringify(vu.list));
    setProgress(Math.round(vu.list.filter((item) => item.finish == true).length / vu.list.length * 100));
}

function load_data() {
    let tasks = JSON.parse(localStorage.getItem("tasks"));
    if (tasks) {
        vu.list = tasks.filter((item) => item.type == 0).concat(
            tasks.filter((item) => item.type == 1).concat(
                tasks.filter((item) => item.type == 2)
            )
        )
    }

    setTimeout(() => {
        let inputs = $(".task-checkbox");
        for (let i = 0; i < inputs.length; i++) {
            const ele = $(inputs[i]);
            ele.prop("checked", vu.list[i].finish);
        }
    }, 1);

    setProgress(Math.round(vu.list.filter((item) => item.finish == true).length / vu.list.length * 100));
}

function sort_list() {
    let tasks = vu.list;
    vu.list = tasks.filter((item) => item.type == 0).concat(
        tasks.filter((item) => item.type == 1).concat(
            tasks.filter((item) => item.type == 2)
        )
    )
}

load_data()
setTimeout(() => {
    init_input_callback();
}, 1);

let height = $(document).height();
let tabs = $(".tab-content");
for (let tab = 0; tab < tabs.length; tab++) {
    $(tabs[tab]).css("height", `${height - 30 - 50}px`);
}

function setProgress(value) {
    const ele = $("#task-progress");
    ele.css("width", value + "%");
    ele.text(value + "%");
}

$("#quit").on("click",() => {
    electronAPI.quitApp();
});

$("#minimize").on("click",() => {
    electronAPI.minimizeApp();
});

function check_date() {
    let date = new Date().toISOString().split('T')[0];
    
    let dateInDB = localStorage.getItem("date");
    localStorage.setItem("date", date);

    let will_remove = [];

    if (!dateInDB || dateInDB != date) {
        for(let i = 0; i < vu.list.length; i++) {
            const item = vu.list[i];
            console.log(item.type == 0 && item.finish == true)
            if (item.type == 0 && item.finish == true) {
                console.log("true")
                will_remove.push(i);
            } else if (item.type == 1) {
                item.finish = false;
                vu.list[i] = item;
            }
        }
    }

    let removeCount = 0;
    for (let i of will_remove) {
        remove_item(i-removeCount);
        removeCount++;
    }

    let currentDate = new Date();
    let oneJan = new Date(currentDate.getFullYear(),0,1);
    let numberOfDays = Math.floor((currentDate - oneJan) / (24 * 60 * 60 * 1000));
    let week = Math.ceil(( currentDate.getDay() + 1 + numberOfDays) / 7);
    let weekInDB = localStorage.getItem("week");
    localStorage.setItem("week", week);

    if (!weekInDB || weekInDB != week) {
        for(let i = 0; i < vu.list.length; i++) {
            const item = vu.list[i];
            if (item.type == 2) {
                item.finish = false;
                vu.list[i] = item;
            }
        }
    }

    save_data();
    load_data();
    setTimeout(() => {
        init_input_callback();
    }, 1);
}

electronAPI.notification("TODO Master", "嘿 別忘了今天的任務哦~");

setInterval(() => {
    console.log("aa");
}, 1000);