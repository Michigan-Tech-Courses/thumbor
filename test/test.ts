import test from 'ava';
import {FIT_IN_TYPE, Thumbor} from '../src';

const thumborFactory = () => new Thumbor({url: 'https://thumbor.example.com', key: 'a-sample-key'});

test('builds URL correctly', t => {
	const url = thumborFactory()
		.setPath('https://images.unsplash.com/photo-1611581893305-ec40e53882fc')
		.smartCrop(true)
		.resize(500, 0)
		.buildURL();

	t.snapshot(url);
});

test('builds URL with original dimension parameters', t => {
	const url = thumborFactory()
		.setPath('https://images.unsplash.com/photo-1611581893305-ec40e53882fc')
		.resize('orig', 'orig')
		.buildURL();

	t.snapshot(url);
});

test('builds URL with 0x0', t => {
	const url = thumborFactory()
		.setPath('https://images.unsplash.com/photo-1611581893305-ec40e53882fc')
		.resize(0, 0)
		.buildURL();

	t.snapshot(url);
});

test('builds URL with trim', t => {
	const url = thumborFactory()
		.setPath('https://images.unsplash.com/photo-1611581893305-ec40e53882fc')
		.trim()
		.buildURL();

	t.snapshot(url);
});

test('builds URL with fit-in', t => {
	const url = thumborFactory()
		.setPath('https://images.unsplash.com/photo-1611581893305-ec40e53882fc')
		.fitIn(100, 100)
		.buildURL();

	t.snapshot(url);
});

test('builds URL with trim & fit-in', t => {
	const url = thumborFactory()
		.setPath('https://images.unsplash.com/photo-1611581893305-ec40e53882fc')
		.trim()
		.fitIn(100, 100)
		.buildURL();

	t.snapshot(url);
});

test('builds URL with adaptive-fit-in', t => {
	const url = thumborFactory()
		.setPath('https://images.unsplash.com/photo-1611581893305-ec40e53882fc')
		.fitIn(100, 100, FIT_IN_TYPE.ADAPTIVE)
		.buildURL();

	t.snapshot(url);
});

test('builds URL with full-fit-in', t => {
	const url = thumborFactory()
		.setPath('https://images.unsplash.com/photo-1611581893305-ec40e53882fc')
		.fitIn(100, 100, FIT_IN_TYPE.FULL)
		.buildURL();

	t.snapshot(url);
});
