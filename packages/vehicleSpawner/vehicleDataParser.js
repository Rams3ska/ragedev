const got = require('got').default;
const cheerio = require('cheerio');

const rootUrl = 'https://wiki.gtanet.work';
const url = 'https://wiki.gtanet.work/index.php?title=Vehicle_Models';

const parseCarsFromSite = async () => {
	const htmlPage = await got(url);
	const $ = cheerio.load(htmlPage.body);

	const result = [];

	const items = $('#mw-content-text > div > ul > li > div');

	[...items].forEach((el) => {
		const item = {
			picture: '',
			name: '',
			hash: '',
			group: '',
		};

		let pictureUrl = rootUrl + $(el).find('div.thumb > div > a > img').attr('src');

		if (pictureUrl.includes('undefined')) return;

		item.picture = pictureUrl;

		[...$(el).find('div.gallerytext > p')].forEach((v) => {
			const itemData = [...v.childNodes].filter((v) => v.type === 'text').map((v) => v.data.replace(/[^A-Za-z0-9-]/g, ''));

			const [name, hash, group] = [itemData[0], itemData[1], itemData[2]];

			item.name = name;
			item.hash = hash;
			item.group = group;
		});

		result.push(item);
	});

	return result;
};

exports.parseCarsFromSite = parseCarsFromSite;
