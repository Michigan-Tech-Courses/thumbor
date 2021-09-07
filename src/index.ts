import crypto from 'crypto';
import {isDefined} from './utils';

export enum VERTICAL_POSITION {
	TOP = 'TOP',
	MIDDLE = 'MIDDLE',
	BOTTOM = 'BOTTOM'
}

export enum HORIZONTAL_POSITION {
	LEFT = 'LEFT',
	CENTER = 'CENTER',
	RIGHT = 'RIGHT'
}

export interface WindowSizeAndPosition {
	top: number;
	bottom: number;
	left: number;
	right: number;
}

export interface Parameters {
	imagePath: string;
	width: number | 'orig';
	height: number | 'orig';
	smart: boolean;
	fitInFlag: boolean;
	fitInAdaptive: boolean;
	withFlipHorizontally: boolean;
	withFlipVertically: boolean;
	halignValue?: HORIZONTAL_POSITION;
	valignValue?: VERTICAL_POSITION;
	cropValues?: WindowSizeAndPosition;
	filtersCalls: string[];
}

const DEFAULT_PARAMETERS: Parameters = {
	imagePath: '',
	width: 0,
	height: 0,
	smart: false,
	fitInFlag: false,
	fitInAdaptive: false,
	withFlipHorizontally: false,
	withFlipVertically: false,
	filtersCalls: []
};

export class Thumbor {
	private readonly url: string;
	private readonly key?: string;

	private parameters: Parameters = DEFAULT_PARAMETERS;

	constructor({url, key}: {url: string; key?: string}) {
		this.url = url;
		this.key = key;
	}

	setPath(path: string) {
		this.parameters.imagePath = (path.startsWith('/')) ? path.slice(1, path.length) : path;

		return this;
	}

	resize(width: Parameters['width'], height: Parameters['height']) {
		this.parameters.width = width;
		this.parameters.height = height;
		this.parameters.fitInFlag = false;
		return this;
	}

	smartCrop(smartCrop: boolean) {
		this.parameters.smart = smartCrop;
		return this;
	}

	fitIn(width: number, height: number, adaptive = false) {
		this.parameters.width = width;
		this.parameters.height = height;
		this.parameters.fitInFlag = true;
		this.parameters.fitInAdaptive = adaptive;
		return this;
	}

	flipHorizontally() {
		this.parameters.withFlipHorizontally = true;
		return this;
	}

	flipVertically() {
		this.parameters.withFlipVertically = true;
		return this;
	}

	halign(halign: HORIZONTAL_POSITION) {
		this.parameters.halignValue = halign;
		return this;
	}

	valign(valign: VERTICAL_POSITION) {
		this.parameters.valignValue = valign;
		return this;
	}

	filter(filterCall: string) {
		this.parameters.filtersCalls.push(filterCall);
		return this;
	}

	crop(crop: WindowSizeAndPosition) {
		this.parameters.cropValues = crop;
		return this;
	}

	buildURL() {
		const operation = this.getOperationPath();

		const dataToEncrypt = operation + '/' + this.parameters.imagePath;

		if (this.key) {
			const digest = crypto
				.createHmac('sha1', this.key)
				.update(dataToEncrypt)
				.digest('base64')
				.replace(/\+/g, '-').replace(/\//g, '_');

			this.parameters = DEFAULT_PARAMETERS;

			return this.url + '/' + digest + '/' + dataToEncrypt;
		}

		this.parameters = DEFAULT_PARAMETERS;

		return this.url + '/unsafe/' + dataToEncrypt;
	}

	private getURLParts() {
		const parts = [];

		if (this.parameters.cropValues) {
			parts.push(
				this.parameters.cropValues.left.toString() +
        'x' + this.parameters.cropValues.top.toString() +
        ':' + this.parameters.cropValues.right.toString() +
        'x' + this.parameters.cropValues.bottom.toString()
			);
		}

		if (this.parameters.fitInFlag) {
			parts.push(
				this.parameters.fitInAdaptive
					? 'adaptative-fit-in'
					: 'fit-in'
			);
		}

		if (
			isDefined(this.parameters.width) ||
      isDefined(this.parameters.height) ||
      this.parameters.withFlipHorizontally ||
      this.parameters.withFlipVertically
		) {
			let sizeString = '';

			if (this.parameters.withFlipHorizontally) {
				sizeString += '-';
			}

			sizeString += this.parameters.width;

			sizeString += 'x';

			if (this.parameters.withFlipVertically) {
				sizeString += '-';
			}

			sizeString += this.parameters.height;

			parts.push(sizeString);
		}

		if (this.parameters.halignValue) {
			parts.push(this.parameters.halignValue);
		}

		if (this.parameters.valignValue) {
			parts.push(this.parameters.valignValue);
		}

		if (this.parameters.smart) {
			parts.push('smart');
		}

		if (this.parameters.filtersCalls.length > 0) {
			parts.push('filters:' + this.parameters.filtersCalls.join(':'));
		}

		return parts;
	}

	private getOperationPath() {
		const parts = this.getURLParts();

		if (parts.length === 0) {
			return '';
		}

		return parts.join('/');
	}
}
