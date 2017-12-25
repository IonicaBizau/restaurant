$(document).ready(function () {

    function hashChange() {
        var hash = location.hash.substr(1);
        if (!hash) { return; }
        restaurant.view(hash)
    }

    function Reg(data) {
        Object.keys(data).forEach(function (c) {
            this[c] = data[c];
        }.bind(this));
    }

    function Restaurant() {
        var self = this;

        this.ui = {
            tblTable: $(".table.table-tbl")
          , tblClients: $(".table.clients-tbl")
          , viewTableMdl: $("#view-table-mdl")
          , tblTableTmpl: null
          , tblClientTmpl: null
        };

        $("td a", this.ui.tblTable).on("click", function () {
            var hash = $(this).attr("href").substr(1);
            location.hash = hash;
            hashChange();
            return false;
        });
        this.ui.viewTableMdl.on('hidden.bs.modal', function () {
            location.hash = "";
            hashChange();
        })


        var $rowTemplate = $(".template", this.ui.tblTable);
        this.ui.tblTableTmpl = $rowTemplate.clone().removeClass("template");
        $rowTemplate.remove();

        $rowTemplate = $(".template", this.ui.tblClients);
        this.ui.tblClientTmpl = $rowTemplate.clone().removeClass("template");
        $rowTemplate.remove();

        this.render(this.getData(), this.ui.tblTableTmpl, $("tbody", this.ui.tblTable));

        // New table
        $("#add-table-mdl form").serializer().on("serializer:data", function (e, formData) {
            self.addTable({
                name: formData.name
              , size: formData.size
              , clients: []
            });
            $(".modal").modal("hide");
            self.render(self.getData(), self.ui.tblTableTmpl, $("tbody", self.ui.tblTable));
        });

        // New client
        $("#add-client-mdl form").serializer().on("serializer:data", function (e, formData) {
            $(".modal").modal("hide");
            if (!formData.table) { return alert("Create a table first"); }
            self.addClient({
                name: formData.name
            }, formData.table);
        });

        $("th input[type='checkbox']").on("change", function () {
            $("td input[type='checkbox']").prop("checked", this.checked);
        });

        $(".btn-delete").on("click", function () {
            self.deleteSelected();
            self.render(self.getData(), self.ui.tblTableTmpl, $("tbody", self.ui.tblTable));
        });
    }

    Restaurant.prototype.getData = function () {
        var data = {};
        try {
            data = JSON.parse(localStorage.getItem("restaurant"))
        } catch (e) {}
        return data || {
            items: []
        };
    };

    Restaurant.prototype.saveData = function (data) {
        localStorage.setItem("restaurant", JSON.stringify(data));
        return data;
    };

    Restaurant.prototype.clear = function () {
        this.ui.tbody.empty();
    };

    Restaurant.prototype.addTable = function (item) {
        var data = this.getData();
        data.items.push(new Reg(item));
        this.saveData(data);
    };

    Restaurant.prototype.addClient = function (item, table) {
        var data = this.getData();
        data.items[table].clients.push(item);
        if (data.items[table].clients.length > data.items[table].size) {
            return alert("Table full.");
        }
        this.saveData(data);
    };

    Restaurant.prototype.deleteSelected = function () {
        var data = this.getData();
        $("td input[type='checkbox']:checked").each(function () {
            var $row = $(this).closest("tr");
            var id = $("[data-id]", $row).attr("data-id");
            data.items[id] = null;
        });
        data.items = data.items.filter(Boolean);
        this.saveData(data);
    };

    Restaurant.prototype.render = function (data, template, container) {

        var self = this;
        data = data || this.getData();
        var items = data.items || data || []
          , html = ""
          ;

        if (!Array.isArray(items)) {
            items = [];
        }

        var $options = [];
        items.forEach(function (c, i) {
            c.i = i + 1;
            c.id = i;
            html += Barbe(template[0].outerHTML, c);
            $options.push($("<option>", { value: c.id, text: c.name }));
        });

        if (container.closest(self.ui.tblTable).length) {
            $("select").html($options);
        }

        container.html(html);
    };

    Restaurant.prototype.getByName = function (name) {
        var data = this.getData();
        var items = data.items || []
        return items.filter(function (c) {
            return c.name === name;
        })[0];
    };

    Restaurant.prototype.view = function (name) {
        var item = this.getByName(name);
        if (!item) {
            return alert("No tables found.");
        }


        $(".modal-title", this.ui.viewTableMdl).text(item.name);
        $(".size", this.ui.viewTableMdl).text(item.size);
        this.render(item.clients || [], this.ui.tblClientTmpl, $("tbody", this.ui.tblClients));
        this.ui.viewTableMdl.modal("show");
    };

    window.restaurant = new Restaurant();
    $(window).on("hashchange", hashChange);
    hashChange();

});
