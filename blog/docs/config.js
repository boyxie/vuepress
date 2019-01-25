module.exports = {
    theme: 'yubisaki',
    title: '我的学习笔记',
    description: `干了不少年了，总要有点记录吧`,
    head: [
        ['link', { rel: 'icon', href: `/favicon.jpg` }]
    ],
    base: '/blog/',
    repo: 'https://github.com/boyxie/vuepress',
    dest: './docs/.vuepress/dist',
    ga: '',
    serviceWorker: true,
    evergreen: true,
    themeConfig: {
        // background: `/img/favicon.jpg`,
        github: 'boyxie',
        logo: '/img/favicon.jpg',
        accentColor: '#ac3e40',
        per_page: 8,
        date_format: 'yyyy-MM-dd',
        tags: true,
        comment: {
            clientID: '',
            clientSecret: '',
            repo: 'vuepress',  // blog of repo name
            owner: 'boyxie',  // github of name
            admin: 'boyxie', // github of name
            distractionFreeMode: false
        },
        nav: [
            {text: 'Blog', link: '/blog/', root: true},
            {text: 'About', link: '/about/'},
            {text: 'TAGS', link: '/tags/', tags: true},
            {text: 'Github', link: 'https://github.com/boyxie'}
        ]
    },
    markdown: {
        anchor: {
            permalink: true
        },
        toc: {
            includeLevel: [1, 2]
        },
        config: md => {
            // 使用更多 markdown-it 插件！
            md.use(require('markdown-it-task-lists'))
            .use(require('markdown-it-imsize'), { autofill: true })
        }
    },
    postcss: {
        plugins: [require('autoprefixer')]
    },
}

