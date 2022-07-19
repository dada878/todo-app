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
        console.log(vu.list)
        vu.list = vu.list.filter(item => item != vu.list[delete_target]);
        setTimeout(() => {
            init_input_callback();
            save_data();
            load_data();
        }, 1);
        delete_value_check = false;
    }
}

function save_data() {
    localStorage.setItem("tasks", JSON.stringify(vu.list));
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
    $(tabs[tab]).css("height", `${height - 5 - 50}px`);
}

window.electronAPI.notification("怎麼辦", "傑哥你幹嘛啦");