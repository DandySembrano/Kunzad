kunzadApp.filter('ControlNo', function ($filter) {
    return function (value) {
        var formattedValue = value.toString();
        while (formattedValue.length < 15)
        {
            formattedValue = "0" + formattedValue;
        }
        return formattedValue;
    }
});
kunzadApp.filter('Date', function ($filter) {
    return function (value) {
        if (value == "" || value == null)
            return "";
        return $filter('date')(value, "MM/dd/yyyy");
    }
});
kunzadApp.filter('DateTime', function ($filter) {
    return function (value) {
        if (value == "" || value == null)
            return "";
        return $filter('date')(value, "MM/dd/yyyy HH:mm:ss");
    }
});
kunzadApp.filter('Time', function ($filter) {
    return function (value) {
        if (value == "" || value == null)
            return "";
        return $filter('date')(value, "HH:mm:ss");
    }
});
kunzadApp.filter('Boolean', function ($filter) {
    return function (value) {
        if (value == true)
            return "Yes";
        else
            return "No";
    }
});
kunzadApp.filter('Bit', function ($filter) {
    return function (value) {
        if (value == 1)
            return "Yes";
        else
            return "No";
    }
});
kunzadApp.filter('Default', function ($filter) {
    return function (value) {
        if (value == "" || value == null)
            return "";
        return value;
    }
});
kunzadApp.filter('StringUpper', function ($filter) {
    return function (value) {
        if (value == "" || value == null)
            return "";
        return value.toUpperCase();
    }
});
kunzadApp.filter('ProperCase', function ($filter) {
    return function (value) {
        if (value == "" || value == null)
            return "";
        var words = value.split(' ');
        for (var i = 0; i < words.length; i++) {
            words[i] = words[i].toLowerCase(); // lowercase everything to get rid of weird casing issues
            words[i] = words[i].charAt(0).toUpperCase() + words[i].slice(1);
        }
        return words.join(' ');
    }
});
kunzadApp.filter('Decimal', function ($filter) {
    return function (value) {
        if (value == "" || value == null)
            return "";
        else
            return value.toFixed(4);

    }
});