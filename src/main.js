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
    for (let i = 0; i < inputs.length; i++) {
        const ele = $(inputs[i]);
        ele.on("change", () => {
            vu.list[i].finish = ele.is(":checked");
            save_data();
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
}, 1)