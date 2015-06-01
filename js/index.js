$(document).ready(function () {
    function Agenda() {
        this.ui = {
            table: $("table")
          , tbody: $("table > tbody")
          , template: null
        };
        var $rowTemplate = $(".template", this.ui.table);
        this.ui.template = $rowTemplate.clone().removeClass("template");
        $rowTemplate.remove();
        this.render();
    }

    Agenda.prototype.getData = function () {
        var data = {};
        try {
            data = JSON.parse(localStorage.getItem("agenda"))
        } catch (e) {}
        return data || {};
    };

    Agenda.prototype.saveData = function (data) {
        localStorage.getItem("agenda") = JSON.stringify(data);
        return data;
    };

    Agenda.prototype.clear = function () {
        this.ui.tbody.empty();
    };

    Agenda.prototype.render = function (data) {
        data = data || this.getData();
        var items = data.items || []
          , html = ""
          ;

        items.forEach(function (c) {
            html += Barbe(this.ui.template[0].outerHTML, c);
        });

        this.ui.tbody.html(html);
    };

    window.agenda = new Agenda();
});
