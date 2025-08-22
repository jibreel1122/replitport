import { createServiceSupabase } from '@/lib/supabase/service'

async function main() {
  const db = createServiceSupabase()

  // Ensure an admin user exists placeholder (id from auth will be different in real env)
  const { data: user } = await db.from('users').insert({ email: 'admin@example.com', name: 'Admin', role: 'admin' }).select().single()
  const createdBy = user?.id

  // Pages
  const pages = ['about','programs','guest-house','education-fund']
  for (const slug of pages) {
    const { data: page } = await db.from('pages').upsert({ slug }).select().single()
    const pageId = page!.id
    if (slug === 'about') {
      const enTitle = 'About FFJ'
      const enBody = {
        type: 'doc', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Friends of Freedom and Justice is a non-profit group working towards justice regarding land rights and civil liberties in the village of Bil\'in. The team works with locals and international alike to draw attention and discussion regarding the village’s dense history as walls shift, crops uprooted, and lives paid. Today we have a number of programs assisting families in the village. We have a Delegation Program aiming to inform and engage conversation with internationals. Topics include agriculture, education, water supply, religion, culture, and more. How are these topics influenced during occupation? There are also volunteer opportunities to work on the farm, assist with community planning and events, as well as during the month of July work with kids at a summer camp. Please see our blog for news and updates on the Friday Demonstrations and, with the help of volunteers and locals, progress made.' }]}] }
      const arTitle = 'من نحن'
      const arBody = { type: 'doc', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'جمعية أصدقاء الحرية والعدالة مجموعة غير ربحية تعمل من أجل العدالة في حقوق الأرض والحريات المدنية في قرية بلعين. يعمل الفريق مع السكان المحليين والدوليين على تسليط الضوء وإثارة النقاش حول تاريخ القرية الغني، مع تغيّر الجدران واقتلاع المحاصيل ودفع الأرواح ثمناً. لدينا اليوم عدد من البرامج التي تساعد العائلات في القرية. لدينا برنامج الوفود الذي يهدف إلى إطلاع الزوار الدوليين وفتح الحوار حول مواضيع متعددة كالفلاحة والتعليم والمياه والدين والثقافة وغيرها، وكيف تتأثر هذه المواضيع خلال الاحتلال. كما توجد فرص تطوعية للعمل في المزرعة والمساعدة في التخطيط المجتمعي والفعاليات، إضافة إلى العمل مع الأطفال في مخيم صيفي خلال شهر تموز. يُرجى متابعة الأخبار حول مسيرات يوم الجمعة والتقدم المحرز بمساعدة المتطوعين والأهالي.' }]}] }
      await db.from('page_translations').upsert([
        { page_id: pageId, locale: 'en', title: enTitle, body: enBody },
        { page_id: pageId, locale: 'ar', title: arTitle, body: arBody }
      ])
    } else if (slug === 'programs') {
      await db.from('page_translations').upsert([
        { page_id: pageId, locale: 'en', title: 'Programs', body: {type: 'doc', content: [{type:'heading', attrs:{level:2}, content:[{type:'text', text:'Delegation Program'}]},{type:'paragraph', content:[{type:'text', text:'Inform and engage internationals about Bil’in.'}]},{type:'heading', attrs:{level:2}, content:[{type:'text', text:'Volunteer Program'}]},{type:'paragraph', content:[{type:'text', text:'Work on the farm and community events.'}]},{type:'heading', attrs:{level:2}, content:[{type:'text', text:'Summer Camp'}]},{type:'paragraph', content:[{type:'text', text:'Activities with kids in July.'}]}]} },
        { page_id: pageId, locale: 'ar', title: 'البرامج', body: {type:'doc', content:[{type:'heading', attrs:{level:2}, content:[{type:'text', text:'برنامج الوفود'}]},{type:'paragraph', content:[{type:'text', text:'التعريف ببلعين والانخراط في الحوار مع الزوار الدوليين.'}]},{type:'heading', attrs:{level:2}, content:[{type:'text', text:'برنامج التطوع'}]},{type:'paragraph', content:[{type:'text', text:'العمل في المزرعة والمساعدة في فعاليات المجتمع.'}]},{type:'heading', attrs:{level:2}, content:[{type:'text', text:'المخيم الصيفي'}]},{type:'paragraph', content:[{type:'text', text:'أنشطة مع الأطفال في شهر تموز.'}]}]} }
      ])
    } else if (slug === 'guest-house') {
      await db.from('page_translations').upsert([
        { page_id: pageId, locale: 'en', title: 'Guest House', body: {type:'doc', content:[{type:'paragraph', content:[{type:'text', text:'Information on FFJ Guest House and booking details.'}]}]} },
        { page_id: pageId, locale: 'ar', title: 'بيت الضيافة', body: {type:'doc', content:[{type:'paragraph', content:[{type:'text', text:'معلومات عن بيت الضيافة وطريقة الحجز.'}]}]} }
      ])
    } else if (slug === 'education-fund') {
      await db.from('page_translations').upsert([
        { page_id: pageId, locale: 'en', title: 'Bil’in Education Fund', body: {type:'doc', content:[{type:'paragraph', content:[{type:'text', text:'Support education in Bil’in. Donate or pledge by email.'}]}]} },
        { page_id: pageId, locale: 'ar', title: 'صندوق التعليم في بلعين', body: {type:'doc', content:[{type:'paragraph', content:[{type:'text', text:'ادعم التعليم في بلعين. تبرع أو أرسل تعهداً عبر البريد.'}]}]} }
      ])
    }
  }

  // News posts
  const titles = [
    'Israeli forces detain two 14-year-old Palestinians in Hebron',
    "Friends Of Freedom And Justice (FFJ) Guest House In Bil'in",
    'Impossible bail sums for Palestinian family',
    "Bil'in Education Fund",
    'Mother tells the story of her torn family due to Israeli occupation',
    'Palestinian protesters in Bil’in commemorate 14th anniversary of death of Rachel Corrie',
    "Bil'in weekly demonstration 3/3/2017",
    'After 12 years we continue',
    '12 Years of Peaceful Resistance',
    'Valentines Raid'
  ]
  for (const title of titles) {
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'')
    const { data: post } = await db.from('posts').insert({ slug, status: 'published', published_at: new Date().toISOString(), created_by: createdBy }).select().single()
    const postId = post!.id
    await db.from('post_translations').insert([
      { post_id: postId, locale: 'en', title, summary: 'Excerpt for ' + title, body: {type:'doc', content:[{type:'paragraph', content:[{type:'text', text:'Body for ' + title}]}]} },
      { post_id: postId, locale: 'ar', title: 'AR ' + title, summary: 'مقتطف: ' + title, body: {type:'doc', content:[{type:'paragraph', content:[{type:'text', text:'المحتوى: ' + title}]}]} }
    ])
    await db.from('post_meta').insert({ post_id: postId, tags: ['ffj','bilin'], category: 'general' })
  }

  // Projects
  const projects = [
    { title: 'Olive Groves Restoration', slug: 'olive-groves-restoration' },
    { title: 'Community Water Access', slug: 'community-water-access' }
  ]
  for (const p of projects) {
    const { data: proj } = await db.from('projects').insert({ slug: p.slug, status: 'active', location: 'Bil’in', created_by: createdBy }).select().single()
    const projectId = proj!.id
    await db.from('project_translations').insert([
      { project_id: projectId, locale: 'en', title: p.title, description: {type:'doc', content:[{type:'paragraph', content:[{type:'text', text:`Description for ${p.title}`}]}]} },
      { project_id: projectId, locale: 'ar', title: 'AR ' + p.title, description: {type:'doc', content:[{type:'paragraph', content:[{type:'text', text:`وصف للمشروع ${p.title}`}]}]} }
    ])
  }

  // Albums
  const albums = [
    { slug: 'friday-demonstrations', en: 'Friday Demonstrations', ar: 'مسيرات الجمعة' },
    { slug: 'life-in-bilin', en: 'Life in Bil’in', ar: 'الحياة في بلعين' },
    { slug: 'guest-house-and-visitors', en: 'Guest House & Visitors', ar: 'بيت الضيافة والزوار' }
  ]
  for (const a of albums) {
    const { data: alb } = await db.from('albums').insert({ slug: a.slug }).select().single()
    const albumId = alb!.id
    await db.from('album_translations').insert([
      { album_id: albumId, locale: 'en', title: a.en },
      { album_id: albumId, locale: 'ar', title: a.ar }
    ])
  }

  console.log('Seed complete')
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})