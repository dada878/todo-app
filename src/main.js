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
    save_data();
    close_form();
    setTimeout(() => {
        init_input_callback();
    }, 1);
});

$("#cancel").on("click", () => {
    close_form();
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
    for (let i of inputs) {
        const ele = $(i);
        ele.on("change", () => {
            vu.list[ele.attr("index")].finish = ele.is(":checked");
            save_data();
        });
    } //FIXME: 修復index重複問題
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

function save_data() {
    localStorage.setItem("tasks", JSON.stringify(vu.list));
}

function load_data() {
    let tasks = JSON.parse(localStorage.getItem("tasks"));
    if (tasks) {
        vu.list = tasks;
    }

    setTimeout(() => {
        let inputs = $(".task-checkbox");
        for (let i of inputs) {
            const ele = $(i);
            ele.prop("checked", vu.list[ele.attr("index")].finish);
            console.log(vu.list[ele.attr("index")].finish);
        }
    }, 1);
}

load_data()
setTimeout(() => {
    init_input_callback();
}, 1)