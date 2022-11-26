/* =============================== 
    FACEBOOK GROUP POSTS SCRAPPER
    Author: Jind Pro <jindessi.rabe@gmail.com>
    Version: 0.1
/* =============================== */

/* =========== Usage =========== */
/* - > Go to a facebook group page using web version
- > Open the inspector
- > Copy code from "START COPYING FROM HERE" comment to "STOP COPYING TO HERE " comment
- > NB: You may need to change thos variable initialize if facebook has changes class names of targeted tag */


/* START COPYING FROM HERE */

/* Variable initializing */
let posts = []; // Init posts list which hold list of posts
const like_count_selector = 'span.x16hj40l'; // like count text selector without the icon
const comment_count_class = 'x193iq5w xeuugli x13faqbe x1vvkbs x1xmvt09 x1lliihq x1s928wv xhkezso x1gmr53x x1cpjm7i x1fgarty x1943h6x xudqn12 x3x7a5m x6prxxf xvq8zen xo1l8bm xi81zsa'; // Text Ex: 3 commentaires
let seeMoreBtnClass = 'x1i10hfl xjbqb8w x6umtig x1b1mbwd xaqea5y xav7gou x9f619 x1ypdohk xt0psk2 xe8uvvx xdj266r x11i5rnm xat24cr x1mh8g0r xexx8yu x4uap5 x18d9i69 xkhd6sd x16tdsg8 x1hl2dhg xggy1nq x1a2a7pz xt0b8zv xzsf02u x1s688f';
const sleep = ms => new Promise(r => setTimeout(r, ms)); // This function is doing pause in code execution while the page is loading post


/* Begin scrapping operation */
while (true) {
    // Scroll to the bottom of the page
    /* window.scrollTo(0, document.body.scrollHeight);
    console.log('sleep ...');
    await sleep(5000);
    console.log('sleep done ...'); */
    for( let i = 0; i < 4; i++){
        window.scrollTo(0, document.body.scrollHeight);
        console.log('sleeping ...')
        await sleep(3000);
        console.log('sleep done.');
    }

    // Click On All "Voir plus" link
    seeMoreBtnClass = seeMoreBtnClass.split(' ').join('.');
    let seeMores = document.querySelectorAll( 'div.' + seeMoreBtnClass );
    seeMores.forEach( item => item.click() );

    // Posts list container
    let posts_container = document.querySelector('div[role=feed]');
    console.log(`Posts length: ${posts_container.childNodes.length}`);
    /* posts_container.childNodes[3] : the 3rd post item wrapper */
    for( let [index, post] of posts_container.childNodes.entries()  ){
        if( index == 0 ) continue;
        if( post.textContent.includes('Invite') ) continue;
        //let description = post.innerText;
        const message = post.querySelector('div[data-ad-preview="message"]');
        let description = message ? message.textContent : post.textContent;
        // if post has has like
        let like = post.querySelector( like_count_selector );
        let like_count = like ? like.innerText : 0;
        let comment_btn = post.querySelectorAll('span.' + comment_count_class.split(' ').join('.'))[2];
        let comment_count = comment_btn ? comment_btn.textContent : '0';
        comment_count = comment_count.replace('commentaires', '').trim();

        if( posts.filter( p => p.description == description ).length == 0 )
            posts.push({ description, like_count, comment_count});

    }

    if( posts.length >= 50 ) break;
}

console.log( posts );

/* STOP COPYING TO HERE */
