
import $ from 'jquery';

export const pageLoaded = (pageId, callback) => {
    $('.loading-overlay').fadeOut();
    $('body').css('overflow', 'auto');
    $(`.${pageId}.browser, .${pageId}.mobile`).fadeIn();

    if (callback) callback();
};
