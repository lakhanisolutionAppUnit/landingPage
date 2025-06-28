/// <reference path="../../../lib/jquery/dist/jquery.min.js" />


var Document_ = {
    Init: function () {
        Document_.Event_();
        Document_.Request.Init();
        Document_.Elem_.Init();
    },

    Event_: function () {
        //$(document).on('change', '[data-ddl="DocumentType"]', function () {
        //    var v = $(this).val();
        //    console.log(v);
        //    //Document_.Elem_.DocumentRefCode(v);
        //    Document_.Elem_.DocumentRowsRevert();
        //    var form = document.getElementById('DocumentForm');
              
        //});
          
        $(document).on('change', '[data-ddl="taxcategory"]', function () { 
            Document_.Request.TaxExemption($(this).val(), $(this));
        });

        $(document).on('change', '[data-ddl="taxexamption"]', function () { 
            Document_.Request.TaxExemptionReason($(this).val(), $(this));
        });

        $(document).on('input', '#Exchange', function () {
            Document_.Calculation.Row();
        });
        $(document).on('input', '#detailsTable tr td input', function () {
            Document_.Calculation.Row();
        });

        $(document).on('click', '#detailsTable tr td [data-btn="removerow"]', function () { 
            var rowCount = $('#detailsTable tr').length;
            if (rowCount > 1) {
                var a = $(this).parent('td').parent('tr');
                $(a).remove();
            } else { 
                Elem.toast({type:'danger',msg:"last row never be remove!"});
            }
            Document_.Calculation.Row();
        }); 
        $(document).on('click', '#detailsTable tr td [data-btn="editremoverow"]', function () {
            var rowCount = $('#detailsTable tr').length;
            if (rowCount > 1) {
                var a = $(this).parent('td').parent('tr');
                var id = $(a).find('[data-id="detailid"]').val();
                console.log("id");
                console.log(id);
                id = (id == undefined || id == '') ? 0 : id;
                if (id != 0) {
                    Document_.Request.RemoveRow(id);
                }
                $(a).remove();
            } else {
                Elem.toast({ type: 'danger', msg: "last row never be remove!" });
            }
            Document_.Calculation.Row();
        });

        $(document).on('click', '#PrepaymentdetailsTable tr td [data-btn="removerow"]', function () {

            var rowCount = $('#PrepaymentdetailsTable tr').length;
            if (rowCount > 1) {
                var a = $(this).parent('td').parent('tr');
                $(a).remove();
            } else {
                Elem.toast({ type: 'danger', msg: "last row never be remove!" });
            }
            Document_.Calculation.Row();
        });
        $(document).on('click', '#PrepaymentdetailsTable tr td [data-btn="editremoverow"]', function () {

            var rowCount = $('#PrepaymentdetailsTable tr').length;
            if (rowCount > 1) {
                var a = $(this).parent('td').parent('tr');
                var id = $(a).find('[data-id="detailid"]').val();
                console.log("id");
                console.log(id);
                if (id != 0 || id != undefined || id != '') {
                    Document_.Request.RemoveRow(id);
                }
                $(a).remove();
            } else {
                Elem.toast({ type: 'danger', msg: "last row never be remove!" });
            }
            Document_.Calculation.Row();
        }); 
        $(document).on('click', '#addRowButton', function () {
            var f = $('[data-ddl="DocumentType"').val();
            if (f =="Prepayment") {
                Elem.toast({ type: 'danger', msg: "Prepayment Document Allow only 1 line item !" });
            } else { 
                var lastRow = $('#detailsTable tr:last');
                var newRow = lastRow.clone();
                newRow.find('input, select').val('').prop('disabled', false);
                newRow.find('[data-id="detailid"]').val(0);
                var newIndex = $('#detailsTable tr').length;
                Document_.Elem_.updateRowIndices(newRow, newIndex);
                $('#detailsTable').append(newRow);
                Document_.Request.Product.Autocomplete(); 
            }
        });

        $(document).on('change', '#documentCodeswitch', function () {        
             if ($(this).is(':checked')) {
                $('#DocumentCode').val('');
            }
        });    

        $(document).on('click', '[data-btn="saveOfheader"]', function () {
            Document_.OtherField.Set($('[data-of]'));
        });
        
    },

    Elem_: {
        Init:function(){
            //    Document_.Elem_.DocumentCode();
            Document_.Elem_.IndicatorCodes();
            //Document_.Elem_.DocumentType();

        },
        DocumentType: function () {
          
            var doctype = $('[data-ddl="DocumentType"]').val();
            if (localStorage.getItem("docType") == undefined)
            {
                localStorage.setItem("docType", doctype);

            } else {
                if (localStorage.getItem("docType") != doctype) {
                    alert();
                }
            }

        },
        IndicatorCodes: function () {
            setTimeout(function () {
                var ele = $('[data-ddl="IndicatorCode"]');
                new Choices(ele, {
                    shouldSort: false
                });
            },800)
        },
        TaxExemption: function (data, ele) { 
            var $select = $(ele).parent('td').find('[data-ddl="taxexamption"]'); 
            $select.empty(); 
            $.each(data, function (index, option) {
                $select.append($('<option>', {
                    value: option.exemptionCode,
                    text: option.exemptionCode
                }));
            });
        },
        TaxExemptionReason: function (data, ele) { 
            $(ele).parent('td').find('[data-text="taxexamptionreason"]').val(data); 
        },
        updateRowIndices: function (row, offset) {
            row.find('input, select , a , div').each(function () {
                var $this = $(this);

                // Update name attribute
                var name = $this.attr('name');
                if (name) {
                    var newName = name.replace(/\[\d+\]/, '[' + offset + ']');
                    $this.attr('name', newName);
                }

                // Update id attribute
                var id = $this.attr('id');
                if (id) {
                    var newId = id.replace(/_\d+_/, '_' + offset + '_');
                    $this.attr('id', newId);
                }


                var target = $this.attr('data-bs-target');
                if (target) {
                    var newtarget = target.replace(/\[(\d+)\]/, '[' + offset + ']');
                    $this.attr('data-bs-target', newtarget);
                }

                var control = $this.attr('aria-controls');
                if (control) {
                    var newcontrol = control.replace(/\[(\d+)\]/, '[' + offset + ']');

                     $this.attr('aria-controls', newcontrol);
                }

                if ($this.attr('aria-labelledby')) {
                    debugger;
                    var id1 = $this.attr('id');
                    var newid1 = id1.replace(/\[(\d+)\]/, '[' + offset + ']');
                    $this.attr('id', newid1);
                }
               

            });
        },
        DocumentRefCode: function (DocType) {
            debugger;
            switch (DocType) {
                case "Invoice":
                case "Prepayment":
                    $('[data-text="DocumentReferenceCode"]').attr("readonly", "readonly");
                    break;
                default:
                    $('[data-text="DocumentReferenceCode"]').removeAttr("readonly");

            }

        },
        DocumentCode: function () {        
           setTimeout(function () {
             if ($('#DocumentCode').val() == '')
             {
                 $('#UseSystemDocumentCode').attr("checked","checked");
             }                                                        
             else {
                 $('#UseSystemDocumentCode').removeAttr("checked", "checked");
             }       
           }, 800);
        },

        DocumentRowsRevert: function () {
            var $table = $("#detailsTable");
            var $rows = $table.find("tr"); 
            $rows.remove();
            //.not(":first")
            var $table1 = $("#PrepaymentdetailsTable");
            var $rows1 = $table1.find("tr");
            $rows1.remove();
            //.not(":first")
        }
    },

    Request: {
        Init: function () {
            Document_.Request.Product.Autocomplete();
            Document_.Request.Prepayment.Autocomplete();
            Document_.Calculation.Row();

        },

        Product: {
            setOtherData: function (ele,data) { 
                $(ele).parent('td').find('[data-text="code"]').val(data.ProductCode);
                $(ele).parent('td').find('[data-text="productarabic"]').val(data.NameArabic);
                $(ele).parent('td').parent('tr').find('[data-text="productprice"]').val(data.Price);
                $(ele).parent('td').parent('tr').find('[data-text="quantity"]').val(1);
                $(ele).parent('td').parent('tr').find('[data-text="taxrate"]').val(15);
                $(ele).parent('td').parent('tr').find('[data-text="discount"]').val(0);
                Document_.Calculation.Row();


            },
            Autocomplete: function () {
                var availableData = [];
                $('[data-ddl="product"]').autocomplete({
                    source: function (request, response) {
                        $.ajax({
                            url: '../api/Dropdown/productSearch',
                            contentType: "application/json",
                            method: 'GET',
                            data: { query: request.term },
                            success: function (data) { 
                                availableData = data.map(function (item) {
                                    return {
                                        label: item.name,
                                        value: item.id,
                                        ProductCode: item.productCode,
                                        NameArabic: item.nameArabic,
                                        Price: item.price
                                    };
                                });
                                response(availableData);
                            },
                            error: function (xhr, status, error) {
                                console.log(xhr);
                                console.log(status);
                                console.log(error);
                                console.error('Error:', error);
                            }
                        });
                    },
                    minLength: 2,
                    select: function (event, ui) {
                        $(this).attr("data-customerid", ui.item.value);
                        $(this).attr("value", ui.item.value);
                        $(this).val(ui.item.label);
                        Document_.Request.Product.setOtherData($(this),ui.item);
                        return false;
                    },
                    open: function () {
                        var widget = $(this).autocomplete("widget");
                        widget.find("li").each(function () {
                            var item = $(this);
                            var data = item.data("ui-autocomplete-item");
                            if (data) {
                                item.html(data.ProductCode + ' - ' + data.label);
                            }
                        });
                    },
                    change: function (event, ui) {
                        if (!ui.item) {
                            $(this).val('');
                        }
                    }
                });

            }
        },
        Prepayment: {
            AddRow: function () {
                var lastRow = $('#PrepaymentdetailsTable tr:last');
                var newRow = lastRow.clone();
                newRow.find('input, select').val('').prop('disabled', false);
                var newIndex = $('#PrepaymentdetailsTable tr').length;
                Document_.Elem_.updateRowIndices(newRow, newIndex);
                $('#PrepaymentdetailsTable').append(newRow);
            },
            VerifyRow: function (ele, data) {
                var found = $(ele).children('tr').get().some(function (row) {
                    var id = $(row).find('td').find('[data-text="PPDocumentID"]').val();
                    if (id == data.id) {
                        return true;  
                    }
                    return false;
                });
                return !found; 
            },
            setOtherData: function (ele, data) { 
                var a = $(ele).children('tr:last');
                $(a).children("td").find('[data-text="PPDocumentID"]').val(data.id);
                $(a).children("td").find('[data-text="PPDocumentCode"]').val(data.documentCode);
                $(a).children("td").find('[data-text="PPUUID"]').val(data.uuid);
                $(a).children("td").find('[data-text="PPIssueTime"]').val(data.documentDate);
                $(a).children("td").find('[data-text="Total"]').val(data.subTotal);
                $(a).children("td").find('[data-text="Totalsar"]').val(data.subTotalSAR);
                $(a).children("td").find('[data-text="TaxAmount"]').val(data.totalVat);
                $(a).children("td").find('[data-text="TaxAmountsar"]').val(data.totalVatSAR);
                $(a).children("td").find('[data-text="Gross"]').val(data.total);
                $(a).children("td").find('[data-text="Grosssar"]').val(data.totalSAR);
                Document_.Request.Prepayment.AddRow();
                Document_.Calculation.Row();
            },
            Autocomplete: function () { 
                var DocData = [];
                $('[data-ddl="PrepaymentDocumentCode"]').autocomplete({
                    source: function (request, response) {
                        $.ajax({
                            url: '../api/Dropdown/prepaymentSearch',
                            contentType: "application/json",
                            method: 'GET',
                            data: { query: request.term },
                            success: function (data) {
                                console.log("Prepayment Data");
                                console.log(data);
                                DocData = data.map(function (item) {
                                    return {
                                        label: item.documentCode,
                                        value: item.id,
                                        uuid: item.uuid,
                                        id: item.id,
                                        documentCode: item.documentCode,
                                        documentType: item.documentType,
                                        documentDate: item.documentDate,
                                        subTotal: item.subTotal,
                                        subTotalSAR: item.subTotalSAR,
                                        totalVat: item.totalVat,
                                        totalVatSAR: item.totalVatSAR,
                                        total: item.total,
                                        totalSAR: item.totalSAR,
                                        taxCategory: item.taxCategory,
                                        taxExemptionReasonCode: item.taxExemptionReasonCode,
                                        taxExemptionReason: item.taxExemptionReason,
                                        productName: 'Prepayment Adjustment',
                                        uuid: item.uuid,
                                    };
                                });
                                response(DocData);
                            },
                            error: function (xhr, status, error) {
                                console.log(xhr);
                                console.log(status);
                                console.log(error);
                                console.error('Error:', error);
                            }
                        });
                    },
                    minLength: 2,
                    select: function (event, ui) {
                        $(this).val('');

                        var s = Document_.Request.Prepayment.VerifyRow($('#PrepaymentdetailsTable'), ui.item);
                        if (s) {
                            Document_.Request.Prepayment.setOtherData($('#PrepaymentdetailsTable'), ui.item);
                        } else {
                            Elem.toast({ type: 'danger', msg: "Document already add in prepayment!" });
                        }
                        return false;
                    },
                    open: function () {
                        var widget = $(this).autocomplete("widget");
                        widget.find("li").each(function () {
                            var item = $(this);
                            var data = item.data("ui-autocomplete-item");
                            if (data) {
                                item.html(data.documentType + ' - ' + data.label);
                            }
                        });
                    },
                    change: function (event, ui) {
                        if (!ui.item) {
                            $(this).val('');
                        }
                    }
                });
            }
        },
        TaxExemption: function (TaxCategory,ele) {
            $.ajax({
                url: '../api/Dropdown/TaxExamption',
                contentType: "application/json",
                method: 'GET',
                data: { query: TaxCategory },
                success: function (data) { 
                    Document_.Elem_.TaxExemption(data, ele); 
                },
                error: function (xhr, status, error) { 
                    console.error('Error:', error);
                }
            });
        },
        TaxExemptionReason: function (TaxExemption, ele) {
            $.ajax({
                url: '../api/Dropdown/TaxExamptionReason',
                contentType: "application/json",
                method: 'GET',
                data: { query: TaxExemption },
                success: function (data) {
                    Document_.Elem_.TaxExemptionReason(data, ele);
                },
                error: function (xhr, status, error) {
                    console.log(xhr);
                    console.log(status);
                    console.log(error);
                    console.error('Error:', error);
                }
            });
        },
        RemoveRow: function (DetailID) {
            debugger;
            $.ajax({
                url: '../Document/RemoveDetailById',
                contentType: "application/json",
                method: 'GET',
                data: { id : DetailID },
                success: function (data) {

                    console.log(data);
                },
                error: function (xhr, status, error) {
                    console.log(xhr);
                    console.log(status);
                    console.log(error);
                    console.error('Error:', error);
                }
            });
        }
    },
    Calculation: {
        Row: function () {

            var lblsubtotal = 0;
            var lbltotal = 0;
            var lblvat = 0;
            var lbldiscount = 0;
            var lblprepaidtotal = 0;
            var exchange = parseFloat($('#Exchange').val());
            $('#detailsTable tr').each(function () { 
                var row = $(this);
                var price = parseFloat(row.find('td').find('[data-text="productprice"]').val()) || 0;

                var qty = parseFloat(row.find('td').find('[data-text="quantity"]').val()) || 0;
                var taxrate = parseFloat(row.find('td').find('[data-text="taxrate"]').val()) || 0;

                var discount = parseFloat(row.find('td').find('[data-text="discount"]').val()) || 0;
                row.find('td').find('[data-text="discountsar"]').val(discount * exchange);

                var subtotal = price * qty;
                var subtotalsar = (price * qty) * exchange;
                var taxAmt = subtotal * (taxrate / 100);
                var taxAmtsar = (subtotal * (taxrate / 100)) * exchange;

                row.find('td').find('[data-text="productpricesar"]').val(Arthamatic.roundHalfUp(price * exchange, 2));
                row.find('td').find('[data-text="taxamt"]').val(Arthamatic.roundHalfUp(taxAmt,2));
                row.find('td').find('[data-text="taxamtsar"]').val(Arthamatic.roundHalfUp(taxAmtsar, 2));
                row.find('td').find('[data-text="total"]').val(Arthamatic.roundHalfUp(subtotal, 2));
                row.find('td').find('[data-text="totalsar"]').val(Arthamatic.roundHalfUp(subtotalsar, 2));
                row.find('td').find('[data-text="gross"]').val(Arthamatic.roundHalfUp((taxAmt + subtotal) - discount, 2));
                row.find('td').find('[data-text="grosssar"]').val(Arthamatic.roundHalfUp((taxAmtsar + subtotalsar) - (discount * exchange), 2));

                lbldiscount = parseFloat(discount) + parseFloat(lbldiscount);
                lblvat = taxAmt + lblvat;
                lblsubtotal = subtotal + lblsubtotal;
                lbltotal = ((taxAmt + subtotal) - discount) + lbltotal;
            });
            $('#PrepaymentdetailsTable tr').each(function () { 
                var row = $(this);
                var total = parseFloat(row.find('td').find('[data-text="Gross"]').val()) || 0;
                
                lblprepaidtotal = parseFloat(total) + lblprepaidtotal ;
            });
            $('[data-lbl="totaldiscount"]').val(Arthamatic.roundHalfUp(lbldiscount, 2));
            $('[data-lbl="totaldiscountsar"]').val(Arthamatic.roundHalfUp(lbldiscount * exchange, 2));

            $('[data-lbl="totalvat"]').val(Arthamatic.roundHalfUp(lblvat, 2));
            $('[data-lbl="totalvatsar"]').val(Arthamatic.roundHalfUp(lblvat * exchange, 2));

            $('[data-lbl="subtotal"]').val(Arthamatic.roundHalfUp(lblsubtotal, 2));
            $('[data-lbl="subtotalsar"]').val(Arthamatic.roundHalfUp(lblsubtotal * exchange, 2));

            $('[data-lbl="prepaidtotal"]').val(Arthamatic.roundHalfUp(lblprepaidtotal, 2));
            $('[data-lbl="prepaidtotalsar"]').val(Arthamatic.roundHalfUp(lblprepaidtotal * exchange, 2));

            $('[data-lbl="total"]').val(Arthamatic.roundHalfUp(lbltotal, 2) - Arthamatic.roundHalfUp(lblprepaidtotal, 2));
            $('[data-lbl="totalsar"]').val(Arthamatic.roundHalfUp(lbltotal * exchange, 2) - Arthamatic.roundHalfUp(lblprepaidtotal * exchange, 2));  
        }
    },
    OtherField: {

        Get: function () {

        },
        Set: function (element) {

            $(element).each(function (i, e) {
                console.log(i);
                console.log(e);
                var a = $(e).val();
                console.log(a);
                var ofno = $(e).attr('data-of');
                Document_.OtherField.CreateFields($('[data-offields]'), ofno, a);

            })

        },
        CreateFields: function (placeholder,ofno,val) {
            var template = '<input type="hidden" name="' + ofno + '" value="' + val + '" />';
            $(placeholder).append(template);
        }
    }

};

$(document).ready(function () {
    Document_.Init();
});
