(function() {
    'use strict';

    var app = {
        isLoading: true,
        container: document.getElementById('container'),
        spinner: document.getElementById('loader')
    };

    app.updateHome = function() {
        app.isLoading = true;
        fetch('data/home.json')
        .then(function(r) {
            return r.text();
        })
        .then(function(body) {
            // console.log(body);
            var data;

            try {
                data = JSON.parse(body);
            } catch (e) {
                alert(e);
                app.isLoading = false;
                app.render();
            } finally {
                app.renderHome(data);
                app.isLoading = false;
                app.render();
            }
        });
    };

    app.render = function() {
        if(app.isLoading) {
            app.container.setAttribute('hidden', true);
            app.spinner.removeAttribute('hidden');
        }
        else {
            app.spinner.setAttribute('hidden', true);
            app.container.removeAttribute('hidden');
        }
    };

    app.renderHome = function(data) {
        var html = '';

        app.container.innerHTML = '';

        html = '<h3>Le top du top</h3>';

        html += '<div class="top-products">';
        for (var product of data.top_products) {
            html += '<a class="top-product top-products__item" href="/product.html">';
            html += app.buildImage(product.media, {
                "width": 64,
                "height:": 64,
                "className": "top-product__image",
                "alt": product.label
            });
            html += '<span class="top-product__label">'+product.label+'</span>';
            html += '<span class="top-product__price">'+app.buildPrice(product.price)+'</span>';
            html += "</a>\n";
        }
        html += '</div>';

        app.container.innerHTML = html;
    };

    app.buildImage = function(media, conf) {
        var tag = '<img src="'+media[0].url+'" ',
            srcset = [];

        for (var i of media) {
            srcset.push(i.url + ' ' + i.width + 'w');
        }

        tag += 'srcset="'+ srcset.join(', ') +'"';

        if(conf.className) {
            tag += ' class="'+conf.className+'"';
        }
        if(conf.alt) {
            tag += ' alt="'+conf.alt+'"';
        }
        if(conf.width) {
            tag += ' width="'+conf.width+'"';
        }
        if(conf.height) {
            tag += ' height="'+conf.height+'"';
        }

        tag += '>';

        return tag;
    };

    app.buildPrice = function(price) {
        return price.amount + '&nbsp;' + price.currency_short;
    };

    document.head.innerHTML += '<link rel="stylesheet" href="dist/css/app.css">';

    app.updateHome();
})();
