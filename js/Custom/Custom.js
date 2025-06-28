/// <reference path="../../lib/jquery/dist/jquery.js" />

var Elem = {
    obj: {}, // Use an object to store Choices instances by ID
    Init: function () {
        Elem.ele();
        Elem.autoCompleteCustomer();
    },
    ele: function () {
        $('select[data-ddl=""]').each(function () {
            var id = $(this).attr('id');
            Elem.obj[id] = new Choices(this, {
                shouldSort: false
            });
        }); 
    },

    autoCompleteCustomer: function () {

        var CustomerchoicesInstance;
        var datasource;

        $('select[data-autocomplete="Customer"]').each(function () {
            
            datasource = $(this).attr('data-datasource');
            CustomerchoicesInstance = new Choices(this, {
                searchEnabled: true,
                itemSelectText: '',
            });
             
            console.log(CustomerchoicesInstance);
            $(CustomerchoicesInstance.input.element).on('input', function () {
                const query = $(this).val();
                if (query.length > 0) {
                    fetchData(query, datasource).then(results => {
                        console.log('Results:', results); 
                        CustomerchoicesInstance.clearChoices();
                        if (results.length > 0) {
                            CustomerchoicesInstance.setChoices(results.map(result => ({
                                value: result.id, 
                                label: result.name 
                            })), 'value', 'label', true);
                        } else {
                            CustomerchoicesInstance.setChoices([{
                                value: '',
                                label: 'No results found'
                            }], 'value', 'label', true);
                        }
                    })
                        .catch(error => {
                        console.error('Error fetching data:', error);
                    });
                }
                else {
                    CustomerchoicesInstance.clearChoices();
                }
            });

            CustomerchoicesInstance.passedElement.addEventListener('addItem', function (event) {
                const selectedValue = event.detail.value;
                console.log('Item Added:', selectedValue);

                //// Handle the selected value
                //$('#hidden-field').val(selectedValue);
                //$(document).trigger('itemSelected', [selectedValue]);
            });


            //CustomerchoicesInstance.input.element.on('Change', function () {

            //    const selectedValues = CustomerchoicesInstance.getValue(true); // Get the selected value(s)
            //    console.log('Selected Values:', selectedValues);

            //    //// Assuming you have a hidden input field with the id 'hidden-field'
            //    //$('#hidden-field').val(selectedValues.join(', ')); // Update the hidden field

            //    //// Fire a custom event or perform additional actions
            //    //$(document).trigger('itemSelected', [selectedValues]);
            //});


        });

         
        function fetchData(query,url) {
            console.log("Fetch Data");
            return $.ajax({
                url: url,//'../api/Autocomplete/search',
                type: 'GET',
                data: { query },
                dataType: 'json',
                success: function (response) {
                    return response.results; // Adjust based on your API's response structure
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    console.error('Error fetching data:', textStatus, errorThrown);
                    return [];
                }
            });
        }
        
    },
    disableSelect: function (elem) {
        var id = $(elem).attr('id'); 
        Elem.obj[id].disable(); 
    },
    enableSelect: function (elem) {
        var id = $(elem).attr('id');
        var originalElem = document.getElementById(id); // Get the original select element

        if (originalElem) {
            $(originalElem).prop('disabled', false); // Enable the original select element

            if (Elem.obj[id]) {
                Elem.obj[id].destroy(); // Destroy the existing Choices instance
                Elem.obj[id] = new Choices(originalElem, {
                    shouldSort: false
                }); // Reinitialize the Choices instance
            }
        }
    },

    toast: function (option = {}) {
        if (option === null) {
            option = {};
        }
        // Default values
        var type = option.type || 'primary'; 
        var msg = option.msg || 'write your message'; 

        // Update toast elements
        var toastElement = $('[data-toast="alert"]');
        toastElement.removeClass('bg-primary bg-secondary bg-success bg-danger bg-warning bg-info bg-light bg-dark'); // Remove all potential background classes
        toastElement.addClass('bg-' + type);
        $('[data-toast="msg"]').html(msg);

        // Initialize and show the toast
        var toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastElement); 
        toastBootstrap.show();
    },
    disabledForm: function (FormID) {

        var formElements = document.getElementById(FormID).elements;
        for (var i = 0; i < formElements.length; i++) {
            var element = formElements[i];
            if (!element.hasAttribute('data-no-disable')) {
                element.disabled = true; // Disable the element
            }
        }
    },
    readonlyForm: function (FormID) {

        var formElements = document.getElementById(FormID).elements;
        for (var i = 0; i < formElements.length; i++) {
            var element = formElements[i];
            if (!element.hasAttribute('data-no-disable')) {
                element.readOnly = true; // Disable the element
            }
        }
    }
};

var Arthamatic = {
    roundHalfUp: function (value, decimalPlaces) {
        const factor = Math.pow(10, decimalPlaces);
        return Math.round(value * factor) / factor;
    }
};
$(document).ready(function () {
    Elem.Init(); 
   
});

