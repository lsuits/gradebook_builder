$(document).ready(function() {
    var category_tmpl = $('div#grade-category-tmpl').find('table');
    var item_tmpl = $('div#grade-item-tmpl').find('tr');
    var weight_tmpl = $('div#category-weight-tmpl').find('div:first');

    function get_selected(selector) {
        return $(selector).children().filter(':selected').html();
    }

    // Add grade category
    $('button#add-category').click(function(e) {
        e.preventDefault();

        var category = category_tmpl.clone();
        var name = $('input#category-name').val();

        category.attr('name', name);

        if (name === '') {
            return;
        }

        category.find('h3').replaceWith('<h3><span>' + name + '</span> <span class="label label-important remove-category-label">X &nbsp;Remove</span></h3>');

        $('div#grade-categories').append(category);

        $('select#add-item-category').append('<option>' + name + '</option>');

        var weight = weight_tmpl.clone();

        weight.attr('name', name);

        weight.find('span:first').replaceWith('<span>' + name + '</span>');

        $('fieldset').append(weight);
    });

    // Add grade item
    $('button#add-item').click(function(e) {
        e.preventDefault();

        var category_name = get_selected('select#add-item-category');

        var category = $('table[name="' + category_name + '"]').find('tbody');

        var to_add = $('input#grade-item-num-add').val();

        for (var i = 0; i < to_add; i++) {
            var item = item_tmpl.clone();
            var num = $('table[name="' + category_name + '"] tbody').children().length + 1;
            var name = category_name +  ' ' + num;

            item.find('span:first').replaceWith('<span>' + name + ' <span class="label label-important remove-item-label">X &nbsp;Remove</span></span>');

            category.append(item);
        }
    });

    // Save item point value
    $('div.point-blank input').live('focusout', function(e) {
        var elem = $(e.currentTarget);
        var val = elem.val();

        var td = elem.parent().parent();

        elem.parent().remove();

        td.append('<span class="badge pull-right">' + val + ' Points</span>');
    });

    // Category remove button
    $('span.remove-category-label').live('click', function(e) {
        var elem = $(e.currentTarget);
        var name = elem.parent().find('span:first').html()

        elem.parent().parent().parent().parent().parent().remove();

        $('div.control-group[name="' + name + '"]').remove();
    });

    // Item remove button
    $('span.remove-item-label').live('click', function(e) {
        $(e.currentTarget).parent().parent().parent().remove();
    });

    // Hover to show remove button for categories
    $('tr').live({
        mouseenter: function(e) {
            $(e.currentTarget).children().find('span.remove-category-label').show();
        },
        mouseleave: function(e) {
            $(e.currentTarget).children().find('span.remove-category-label').hide();
        }
    });

    // Hover to show remove button for items
    $('tr').live({
        mouseenter: function(e) {
            $(e.currentTarget).children().find('span.remove-item-label').show();
        },
        mouseleave: function(e) {
            $(e.currentTarget).children().find('span.remove-item-label').hide();
        }
    });

    // Show or hide category weights
    $('select#grading-method').change(function(e) {
        var val = get_selected('select#grading-method');

        if (val === 'Custom Weights') {
            $('form#category-weights').show();
        } else {
            $('form#category-weights').hide();
        }

    });

    // Convert form to JSON and Submit on save button click
    $('form#builder').submit(function() {
        var gb = {};

        gb['name'] = "New Template";
        gb['aggregation'] = get_selected('select#grading-method');
        gb['categories'] = [];

        $('div#builder-start').find('table').each(function() {
            var cat_obj = {};

            cat_obj['name'] = $(this).find('span:first').html();
            cat_obj['weight'] = 1;

            var parent = $(this);

            var items = [];

            parent.find('td').each(function() {
                var gi_name = $(this).find('span:first').clone().children().remove().end().text().trim();
                var gi_points = $(this).find('span:last').html().split(' ')[0];

                items.push({
                    'name': gi_name,
                    'grademax': gi_points,
                    'itemtype': 'manual',
                });
            });

            cat_obj['items'] = items;

            gb['categories'].push(cat_obj);
        });

        $('input[name="json"]').val(JSON.stringify(gb));

        return true;
    });
});
