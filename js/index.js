$(document).ready(function () {

    function hashChange() {
        var hash = location.hash.substr(1);
        if (!hash) { return; }
        agenda.view(hash)
    }

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
          , viewMdl: $("#view-item-mdl")
        };
        var $rowTemplate = $(".template", this.ui.table);
        this.ui.template = $rowTemplate.clone().removeClass("template");
        $rowTemplate.remove();
        this.render();
        this.ui.type.on("change", function () {
            self.changeType(this.value);
            self.type = this.value;
        });
        this.type = "basic";
        this.ui.form.serializer().on("serializer:data", function (e, formData) {
            self.add({
                type: self.type
              , firstName: formData.firstName
              , lastName: formData.lastName
              , email: formData.email
              , phone: formData.phone
              , address: formData.address
              , avatar: formData.avatar
              , bio: formData.bio
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

    Agenda.prototype.getByEmail = function (email) {
        var data = this.getData();
        var items = data.items || []
        return items.filter(function (c) {
            return c.email === email;
        })[0];
    };

    Agenda.prototype.view = function (email) {
        var item = this.getByEmail(email);
        if (!item) {
            return this.ui.viewMdl.html("<div class='alert alert-danger'>No item found.</div>");
        }
        var $body = $(".modal-body", this.ui.viewMdl);
        $body.empty();
        $body.append($("<h1>", { text: item.firstName + " " + item.lastName }));
        $body.append($("<a>", { href: "mailto:" + item.email, text: item.email }));
        $body.append($("<p>", { text: "Phone: " + item.phone }));
        if (item.type === "mean" || item.type === "extended") {
            $body.append($("<p>", { text: "Address: " + item.address }));
            $body.append($("<p>", { text: "Biography: " + item.bio }));
        }
        if (item.type === "extended") {
            $body.append($("<img>", { src: item.avatar }));
            $body.append($("<p>", { text: "Hangouts: " + item.hangouts }));
        }

        this.ui.viewMdl.modal("show");
    };

    window.agenda = new Agenda();
    $(window).on("hashchange", hashChange);
    hashChange();

});
