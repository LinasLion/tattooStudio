import img from '../img/img1.jpg'


export function Content() {

    return (
        <main className={'content'}>
            <div className={'author'}>
                <img src={img} alt="author"/>
            </div>
            <div className={'content__info'}>
                <h1 className={'websiteTitle'}>TATTOO STUDIO</h1>
                <h3 className={'websiteSubtitle'} >Best tattoo studio ever!!!</h3>
                <p className={'content__info__text'}>
                    Bob Tyrrell Having an incredible artist for a father, I grew up wanting to be an artist myself. I
                    started playing guitar in my teens and gave up art completely to pursue a career in music. I spent
                    the next fifteen years playing in heavy metal bands and working a factory job. I’d wanted to get
                    tattooed for years and, just shy of turning 30, I got my first tattoo. Of course, I was hooked and
                    got my sleeves and a full back piece done within a few years. During this time I got back into
                    drawing and took a few art classes. Now it was time to learn how to tattoo! I took some drawings to
                    Tramp, the owner of Eternal Tattoos, who are based in the Detroit area where I grew up. I was
                    offered an apprenticeship, and within three months I had quit my job and was tattooing full time. I
                    was 34 years old when I started – a little late in the game, but better late than never! Tom Renshaw
                    was working there and took me under his wing. Tom went WAY out of his way to help me, he really
                    pushed me those first couple of years. I learned more from him than anyone in the business, and I’ll
                    be forever grateful to him and Tramp – I owe them a lot. I stayed at Eternal for six years. I am
                    currently working on the road doing tattoo conventions and guest spots at tattoo shops. Check the on
                    the road page for my schedule. So I guess I finally grew up and became an artist – my original plan
                    as a kid. I think I found my true calling. I want to cut back on traveling a little so I can learn
                    how to paint, do more fine art and tattoo more, but I just can't stop! I’d like to thank all my
                    friends who’ve helped me become a better artist. There’s way too many to name, but I’ll name a few:
                    my father Robert J. Tyrrell, Paul Booth (still my biggest influence and favorite tattoo artist),
                    Robert Hernandez (fucking amazing!), Guy Aitchison, Filip Leu, Shane O’Neill, Jack Rudy, Jay
                    Wheeler, Jimé Litwalk, Joe Capobianco, Gunnar, everyone at Last Rites, Mario Barth, Shige, Brian
                    Everett, Boris, Deano Cook, and a million other artists – you know who you are! Thanks for the never
                    ending inspiration.
                </p>
            </div>

        </main>
    )
}