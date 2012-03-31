domReady(function(){

    sink('molt',function(test,ok,before,after){

        test('Modes',7,function(){
            log('Please play with window size to execute all tests');
            // Get nodes
            var nodes=document.getElementsByTagName('img'),
                a,b,c,d,e,f,g,h,i,j;
            // 320 and 768 with first image
            molt.listen(
                nodes[0],
                function(mode){
                    var width=W();
                    if(!j && width<320 && mode==320){
                        ok(this.src.indexOf('images/img1-320.jpg')!=-1,'320 mode with first image when width is less than 320px');
                        j=true;
                    }
                    else if(!b && width<480 && mode==320){
                        ok(this.src.indexOf('images/img1-320.jpg')!=-1,'320 mode with first image');
                        b=true;
                    }
                    else if(!c && width>=768 && mode==768){
                        ok(this.src.indexOf('images/img1-768.jpg')!=-1,'768 mode with first image');
                        c=true;
                    }
                }
            );
            // 320 and 768 with second image
            molt.listen(
                nodes[1],
                function(mode){
                    var width=W();
                    if(!i && width<320 && mode==320){
                        ok(this.src.indexOf('images/img2-320.jpg')!=-1,'320 mode with second image when width is less than 320px');
                        i=true;
                    }
                    else if(!d && width<480 && mode==320){
                        ok(this.src.indexOf('images/img2-320.jpg')!=-1,'320 mode with second image');
                        d=true;
                    }
                    else if(!e && width>=768 && mode==768){
                        ok(this.src.indexOf('images/img2-768.jpg')!=-1,'768 mode with second image');
                        e=true;
                    }
                }
            );
            // 320 and 768 with third image
            molt.listen(
                nodes[2],
                function(mode){
                    var width=W();
                    if(!h && width<320 && mode==768 && this.style.display=='block'){
                        ok(this.src.indexOf('images/img3-768.jpg')!=-1,'768 mode with third image when width is less than 320px');
                        h=true;
                    }
                    else if(!f && width<480 && mode==768 && this.style.display=='block'){
                        ok(this.src.indexOf('images/img3-768.jpg')!=-1,'768 mode with third image');
                        f=true;
                    }
                    else if(!g && width>=768 && mode==320 && this.style.display=='block'){
                        ok(this.src.indexOf('images/img3-320.jpg')!=-1,'320 mode with third image');
                        g=true;
                    }
                }
            );
            // Discover images
            molt.discover();
            // !480
            W(function(){
                if(!a){
                    var width=W();
                    if(width>=480 && width<768){
                        ok(nodes[0].style.display=='none' && nodes[1].style.display=='none' && nodes[2].style.display=='none','!480 mode with all images');
                        a=true;
                    }
                }
            });
        });

        test('discover', 2, function(){
          ok(molt.discover().length == 3, 'returns the 3 images')
          ok(molt.discover().length == 3, 'does not rediscover found images')
        })

        test('Ender',2,function(){
            ok($($('img')[0]).listen,'Listen method registered');
            ok($.discover,'Discover method registered');
        });

    });

    start();

});
