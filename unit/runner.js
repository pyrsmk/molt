domReady(function(){

    sink('molt',function(test,ok,before,after){
        
        test('Modes',7,function(){
            log('Please play with window size to execute all tests');
            // Get nodes
            var nodes=document.getElementsByTagName('img'),
                a,b,c,d,e,f,g;
            // 320 and 768 with first image
            molt.listen(nodes[0],function(node){
                var width=W();
                if(!g && width<320){
                    ok(node.src.indexOf('images/img1-320.jpg')!=-1,'320 mode with first image when width is less than 320px');
                    g=true;
                }
                else if(!b && width<480){
                    ok(node.src.indexOf('images/img1-320.jpg')!=-1,'320 mode with first image');
                    b=true;
                }
                else if(!c && width>=768){
                    ok(node.src.indexOf('images/img1-768.jpg')!=-1,'768 mode with first image');
                    c=true;
                }
            });
            // 320 and 768 with second image
            molt.listen(nodes[1],function(node){
                var width=W();
                if(!f && width<320){
                    ok(node.src.indexOf('images/img2-320.jpg')!=-1,'320 mode with second image when width is less than 320px');
                    f=true;
                }
                else if(!d && width<480){
                    ok(node.src.indexOf('images/img2-320.jpg')!=-1,'320 mode with second image');
                    d=true;
                }
                else if(!e && width>=768){
                    ok(node.src.indexOf('images/img2-768.jpg')!=-1,'768 mode with second image');
                    e=true;
                }
            });
            // Discover images
            molt.discover();
            // !480
            W(function(){
                if(!a){
                    var width=W();
                    if(width>=480 && width<768){
                        ok(nodes[0].style.display=='none' && nodes[1].style.display=='none','!480 mode width both images');
                        a=true;
                    }
                }
            });
        });

    });

    start();

});
