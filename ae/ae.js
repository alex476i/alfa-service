var MySlider = (function () {
    var controls = { close: null, prev: null, next: null };
    var containers = { image: null, thumbs: null, caption: null };
    var sessionDefaults = { start: false, group: undefined, items: [], index: 0 };

    function MySlider(element) {
        this.element = element;
        this.session = $.extend({}, sessionDefaults);
        initControls.call(this, this.element);
    }

    function initControls(element) {
        var self = this;
        controls.close = element.find(".ae-slider-controls > .ae-slider-close");
        controls.close.on("click", function () { self.close(); });
        controls.prev = element.find(".ae-slider-controls > .ae-slider-prev");
        controls.prev.on("click", function () { self.slidePrev(); });
        controls.next = element.find(".ae-slider-controls > .ae-slider-next");
        controls.next.on("click", function () { self.slideNext(); });

        containers.image = element.find(".ae-slider-controls > .ae-slider-image > img");
        containers.thumbs = element.find(".ae-slider-thumbs > div");
        containers.thumbs.on("click", function() { setImage.call(self, self.session.items.indexOf($(this).index())); });
        containers.caption = element.find(".ae-slider-caption > h5");

        $(document).on('keydown', function (e) {
            if (self.session.start) {
                if (e.keyCode === 27) { self.close(); }
                if (e.keyCode === 37) { self.slidePrev(); }
                if (e.keyCode === 39) { self.slideNext(); }
            }
        });
    }

    function filterGroup(groupId, all) {
        var self = this;
        self.session.items = [];

        $.each(containers.thumbs, function (index, item) {
            if ($(item).data("group-id") == groupId || groupId === undefined || all) {
                self.session.items.push(index);
                $(item).show();
            } else {
                $(item).hide();
            }
        });
    }

    function setImage(index) {
        var self = this;
        if (index !== undefined && index !== -1) { self.session.index = index; }
        var thumb = $(containers.thumbs[self.session.items[self.session.index]]);
        containers.image.attr("src", thumb.data("image"));
        containers.thumbs.removeClass("selected");
        thumb.addClass("selected");
        containers.caption.html(thumb.data("caption"))
    }

    function getIndex(groupId, itemId) {
        var result = undefined;
        $.each(containers.thumbs, function (index, item) {
            if ($(item).data("id") == itemId && $(item).data("group-id") == groupId) { result = index; }
        });
        return result;
    }

    MySlider.prototype.open = function (groupId, itemId, all) {
        this.session.start = true;
        this.session.group = groupId;
        filterGroup.call(this, this.session.group, all);
        setImage.call(this, this.session.items.indexOf(getIndex.call(this, groupId, itemId)));
        this.element.show(200);
    };

    MySlider.prototype.close = function () {
        this.session = $.extend({}, sessionDefaults);
        this.session.start = false;
        this.element.hide(200);
        containers.image.attr("src", "");
    };

    MySlider.prototype.slideNext = function () {
        if (this.session.index < this.session.items.length - 1) { this.session.index += 1; } else { this.session.index = 0; }
        setImage.call(this);
    };

    MySlider.prototype.slidePrev = function () {
        if (this.session.index == 0) { this.session.index = this.session.items.length - 1; } else { this.session.index -= 1; }
        setImage.call(this);
    };

    return MySlider;
})();