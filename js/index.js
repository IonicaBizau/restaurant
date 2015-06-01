$(document).ready(function () {
    function Agenda() {
        this.ui = {
            table: $("table")
          , template: null
        };
        var $rowTemplate = $(".template", this.ui.table);
        this.ui.template = $rowTemplate.clone().removeClass("template");
        $rowTemplate.remove();
    }

    Agenda.prototype.getData = function () {
        var data = {};
        try {
            data = JSON.parse(localStorage.getItem("agenda"))
        } catch (e) {}
        return data;
    };

    Agenda.prototype.saveData = function (data) {
        localStorage.getItem("agenda") = JSON.stringify(data);
        return data;
    };

    window.agenda = new Agenda();
});
