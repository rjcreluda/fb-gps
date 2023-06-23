chrome.runtime.onMessage.addListener( async function (request, sender, sendResponse) {
    console.log('request.maxCount: ' + request.maxCount + ', sender: ');
    console.log( sender );
    if( request.currentUrl && request.maxCount ){
        var currentUrl = new URL(request.currentUrl);
        const maxCount = request.maxCount;
        if( currentUrl.hostname == 'mobile.facebook.com' || currentUrl.hostname == 'm.facebook.com' ){
            // Mobile version
            await scrapeDOMobile( maxCount );
        }
        else if( currentUrl.hostname == 'web.facebook.com' ){
            // Web version
            await scrapeDOM( request.maxCount  );
        }
        else{
            alert('Unsupported url: ' + request.currentUrl);
        }
    }
});

async function scrapeDOM( maxCount ) {
    console.log('Running code web version ...');
    /* Variable initializing */
    let posts = []; // Init posts list which hold list of posts
    const like_count_selector = 'span.x1e558r4'; // like count text selector without the icon
    const comment_count_class = 'x193iq5w xeuugli x13faqbe x1vvkbs x1xmvt09 x1lliihq x1s928wv xhkezso x1gmr53x x1cpjm7i x1fgarty x1943h6x xudqn12 x3x7a5m x6prxxf xvq8zen xo1l8bm xi81zsa'; // Text Ex: 3 commentaires
    let seeMoreBtnClass = 'x1i10hfl xjbqb8w x6umtig x1b1mbwd xaqea5y xav7gou x9f619 x1ypdohk xt0psk2 xe8uvvx xdj266r x11i5rnm xat24cr x1mh8g0r xexx8yu x4uap5 x18d9i69 xkhd6sd x16tdsg8 x1hl2dhg xggy1nq x1a2a7pz xt0b8zv xzsf02u x1s688f';
    const title_wrapper_class = 'div.xu06os2.x1ok221b'; // For Ad title text content
    const sleep = ms => new Promise(r => setTimeout(r, ms)); // This function is doing pause in code execution while the page is loading post
    const MAX_POST = maxCount || 15;


    /* Begin scrapping operation */
    while (true) {
        // Scroll to the bottom of the page
        /* window.scrollTo(0, document.body.scrollHeight);
        console.log('sleep ...');
        await sleep(5000);
        console.log('sleep done ...'); */
        for( let i = 0; i < 2; i++){
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
        let posts_containers = document.querySelectorAll('div[role=feed]');
        for( let posts_container of posts_containers ){
            console.log(`Posts length: ${posts_container.childNodes.length}`);
            for( let [index, post] of posts_container.childNodes.entries()  ){
                if( index == 0 ) continue;
                if( post.textContent.includes('Invite') ) continue;
                //let description = post.innerText;
                const message = post.querySelector('div[data-ad-preview="message"]');
                let description = message ? message.textContent : post.textContent;
                // if post has has like
                let like = post.querySelectorAll( like_count_selector );
                let like_count = like.length > 0 ? Number(like[1].innerText) : 0;
                let comment = post.querySelectorAll('span.' + comment_count_class.split(' ').join('.'));
                const array = [...comment];
                const comment_text = array.at(-1)?.textContent;
                let comment_count = null;
                if( comment_text ){
                    comment_count = comment_text.length <= 20 ? comment_text : '0';
                }
                else{
                    comment_count = '0';
                }

                // Brand, post title
                let title, price;
                const title_wrapper = post.querySelectorAll('a ' + title_wrapper_class );
                if( title_wrapper.length > 1 ){
                    price = title_wrapper[0].innerText;
                    title = title_wrapper[1].innerText;
                }

                if( price ){
                    const pricePattern = /\d+(\s?\d+)?(\s?\d+)?(\s?\d+)?/;
                    const match = price.match(pricePattern);
                    if (match) {
                        price = match[0].replace(/\s/g, '');
                    }
                }
                
        
                if( posts.filter( p => p.description == description ).length == 0 )
                    posts.push({ title, description, like_count, comment_count, price});

                if( posts.length >= MAX_POST ) break;
        
            }
        }

        if( posts.length >= MAX_POST ) break;
    }

    if( posts.length > 0 ){
        console.log(posts);
        const groupeName = document.querySelector('h1 span a');
        // Export to Excel file
        exportToExcelWithLib(posts, groupeName?.innerText);
    }
}

async function scrapeDOMobile( maxCount ) {
    console.log('Running code mobile version ...');
    /* Variable initializing */
    let posts = []; // Init posts list which hold list of posts
    const like_count_selector = 'footer div[data-sigil=reactions-sentence-container]'; // like count text selector without the icon
    const comment_count_class = 'footer span[data-sigil=comments-token]'; // Text Ex: 3 commentaires
    //let seeMoreBtnClass = 'x1i10hfl xjbqb8w x6umtig x1b1mbwd xaqea5y xav7gou x9f619 x1ypdohk xt0psk2 xe8uvvx xdj266r x11i5rnm xat24cr x1mh8g0r xexx8yu x4uap5 x18d9i69 xkhd6sd x16tdsg8 x1hl2dhg xggy1nq x1a2a7pz xt0b8zv xzsf02u x1s688f';
    const title_wrapper_class = 'div._4gus'; // For Ad title text content
    const date_wrapper_class = '.story_body_container header abbr';
    const content_wrapper_class = '.story_body_container header + div';
    const posts_list_class = 'div#m_group_stories_container';
    const price_wrapper_class = 'header + div + div div._4guw';
    const sleep = ms => new Promise(r => setTimeout(r, ms)); // This function is doing pause in code execution while the page is loading post
    const MAX_POST = maxCount || 15;


    /* Begin scrapping operation */
    while (true) {
        // Scroll to the bottom of the page
        /* window.scrollTo(0, document.body.scrollHeight);
        console.log('sleep ...');
        await sleep(5000);
        console.log('sleep done ...'); */
        for( let i = 0; i < 2; i++){
            window.scrollTo(0, document.body.scrollHeight);
            console.log('sleeping ...')
            await sleep(3000);
            console.log('sleep done.');
        }

        // Click On All "Voir plus" link
        /* seeMoreBtnClass = seeMoreBtnClass.split(' ').join('.');
        let seeMores = document.querySelectorAll( 'div.' + seeMoreBtnClass );
        seeMores.forEach( item => item.click() ); */

        // Posts list container
        const posts_container = document.querySelector(posts_list_class);
        const articles = posts_container.querySelectorAll('article');
        
        console.log(`Posts length: ${articles.length}`);
        for( let [index, post] of articles.entries()  ){
            if( index == 0 ) continue;
            if( post.textContent.includes('Invite') ) continue;
            // Post text content
            const content = post.querySelector( content_wrapper_class );
            let description = content ? content.textContent : '';
            // if post has has like
            let like = post.querySelector( like_count_selector );
            let like_count = Number(like.innerText);
            // If post has comment
            let comment_btn = post.querySelector( comment_count_class );
            let comment_count = comment_btn?.textContent || 0;
            //comment_count = comment_count.replace('commentaires', '').trim();
            // Post date
            let date_in = post.querySelector( date_wrapper_class );
            const post_date = date_in.textContent;

            // Post title & price
            let title, price;

            const title_wrapper = post.querySelector( title_wrapper_class );
            title = title_wrapper ? title_wrapper.innerText : '';

            const price_wrapper = post.querySelector( price_wrapper_class );
            price = price_wrapper ? price_wrapper.innerText : null;         
    
            if( posts.filter( p => p.description == description ).length == 0 )
                posts.push({ title, description, like_count, comment_count, price, post_date});

            if( posts.length >= MAX_POST ) break;
    
        }

        if( posts.length >= MAX_POST ) break;
    }

    if( posts.length > 0 ){
        console.log(posts);
        const groupeName = document.querySelector('h1 div')?.textContent || 'gp';
        // Export to Excel file
        exportToExcelWithLib(posts, groupeName);
    }
}

function exportToExcelWithLib(jsonData, fbGroupName) {
    console.log('Export to Excel ...');
    var worksheet = XLSX.utils.json_to_sheet(jsonData);
    var workbook = XLSX.utils.book_new();

    // Define table style
    const tableStyle = {
        font: { bold: true },
        fill: { fgColor: { rgb: "0000FF" } },
        border: {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
        },
    };

    // Apply table style to headers
    const headerRange = XLSX.utils.decode_range(worksheet["!ref"]);
    for (let col = headerRange.s.c; col <= headerRange.e.c; col++) {
        const headerCell = XLSX.utils.encode_cell({ r: headerRange.s.r, c: col });
        worksheet[headerCell].s = tableStyle;
    }

    // Apply borders to data cells
    const dataRange = XLSX.utils.decode_range(worksheet["!ref"]);
    for (let row = dataRange.s.r + 1; row <= dataRange.e.r; row++) {
        for (let col = dataRange.s.c; col <= dataRange.e.c; col++) {
            const cell = XLSX.utils.encode_cell({ r: row, c: col });
            worksheet[cell].s = {
                border:{
                    top:{style:'thin',color:{auto:true}},
                    right:{style:'thin',color:{auto:true}},
                    bottom:{style:'thin',color:{auto:true}},
                    left:{style:'thin',color:{auto:true}}
                }
            };
        }
    }

    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    var excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    var data = new Blob([excelBuffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    var url = URL.createObjectURL(data);

    let link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", generateUniqueFileName( fbGroupName ) );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  
}

function generateUniqueFileName( fbGroupName ) {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const day = String(currentDate.getDate()).padStart(2, '0');
    const hours = String(currentDate.getHours()).padStart(2, '0');
    const minutes = String(currentDate.getMinutes()).padStart(2, '0');
    const seconds = String(currentDate.getSeconds()).padStart(2, '0');
    const fileName = `Sells-On-${fbGroupName}-By-JPro-${year}${month}${day}${hours}${minutes}${seconds}.xls`;
    return fileName;
  }
  

function exportToExcel(jsonData) {
    let xlsContent = "data:application/vnd.ms-excel;charset=utf-8,";
    let keys = Object.keys(jsonData[0]);
    xlsContent += keys.join("\t") + "\r\n";
    
    jsonData.forEach(function(item) {
        let row = [];
        keys.forEach(function(key) {
        row.push(item[key]);
        });
        xlsContent += row.join("\t") + "\r\n";
    });
    
    let encodedUri = encodeURI(xlsContent);
    let link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "data.xls");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

