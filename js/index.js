$(document).ready(function () {

    function Reg(data) {
        Object.keys(data).forEach(function (c) {
            this[c] = data[c];
        }.bind(this));
    }

    function Agenda() {
        var self = this;
        this.ui = {
            table: $("table")
          , tbody: $("table > tbody")
          , template: null
          , type: $("input[name='type']")
          , form: $("form")
        };
        var $rowTemplate = $(".template", this.ui.table);
        this.ui.template = $rowTemplate.clone().removeClass("template");
        $rowTemplate.remove();
        this.render();
        this.ui.type.on("change", function () {
            self.changeType(this.value);
            self.type = this.value;
        });
        this.ui.form.serializer().on("serializer:data", function (e, formData) {
            self.add({
                type: self.type
              , firstName: formData.firstName
              , lastName: formData.lastName
              , email: formData.email
              , phone: formData.phone
              , address: formData.address
              , avatar: formData.avatar
              , hangouts: formData.hangouts
            });
            $(".modal").modal("hide");
            self.render();
        });
        this.changeType("basic");
        $("th input[type='checkbox']").on("change", function () {
            $("td input[type='checkbox']").prop("checked", this.checked);
        });
        $(".btn-delete").on("click", function () {
            self.deleteSelected();
            self.render();
        });
    }

    Agenda.prototype.changeType = function (type) {
        $("[data-type]").show().removeAttr("required");
        if (type === "basic") {
            $("[data-type]").hide();
        } else if (type === "mean") {
            $("[data-type='extended']").hide();
        }
    };

    Agenda.prototype.getData = function () {
        var data = {};
        try {
            data = JSON.parse(localStorage.getItem("agenda"))
        } catch (e) {}
        return data || {};
    };

    Agenda.prototype.saveData = function (data) {
        localStorage.setItem("agenda", JSON.stringify(data));
        return data;
    };

    Agenda.prototype.clear = function () {
        this.ui.tbody.empty();
    };

    Agenda.prototype.add = function (item) {
        var data = this.getData();
        data.items = data.items || [];
        data.items.push(new Reg(item));
        this.saveData(data);
    };

    Agenda.prototype.deleteSelected = function () {
        var data = this.getData();
        data.items = data.items || [];
        $("td input[type='checkbox']:checked").each(function () {
            var $row = $(this).closest("tr");
            var id = $("[data-id]", $row).attr("data-id");
            data.items[id] = null;
        });
        data.items = data.items.filter(Boolean);
        this.saveData(data);
    };

    Agenda.prototype.render = function (data) {
        var self = this;
        data = data || this.getData();
        var items = data.items || []
          , html = ""
          ;

        items.sort(function (a, b) {
            return a.name > b.name ? 1 : -1;
        });

        items.forEach(function (c, i) {
            c.i = i + 1;
            c.id = i;
            html += Barbe(self.ui.template[0].outerHTML, c);
        });

        this.ui.tbody.html(html);
    };

    window.agenda = new Agenda();
});
