
// ray test touch <
import React, { Component, Fragment } from 'react';
import Grid from '@material-ui/core/Grid';

import GifGenWidget from './GifGenWidget';
import ImageList from './ImageList';
import Logo from '../../components/Logo';
import ProgressBar from '../../components/ProgressBar';
import LoadingSpinner from 'components/UI/LoadingSpinner';
import AdaptiveImagesModal from '../../components/AdaptiveImagesModal';
import config from 'config';
import { createGIF, getMetaInfo } from '../../utils/utility';
import searchFolder from 'services/search-folder';

class Gallery extends Component {
	state = {
		images: [],
		selectedStatusList: [],
		isProgressBarShown: false,
		loading: false,
		allSelected: false,
		isGifWidgetOpen: false,
		isImagesModalOpen: false,
		currentModalIndex: null
	};

	componentDidMount() {
		if (window.gapi && window.gapi.client) {
			this.loadHandler();
		} else {
			setTimeout(this.loadHandler, 1000); // TODO: hardcoded & error prone
		}
	}
	
	loadHandler = () => {
		this.setState({loading: true});
		window.gapi.load('auth', {'callback': this.gapiInitHandler});
	};

	gapiInitHandler = async () => {
		try {
			await window.gapi.client.init({
				apiKey: config.API_KEY,
				clientId: config.CLIENT_ID,
				discoveryDocs: [config.DISCOVERY_DOCS],
				scope: `${config.READ_ONLY_SCOPE} ${config.FILE_SCOPE}`
			});

			const folderId = await searchFolder(config.FOLDER_NAME);
			this.getImagesFromGoogleDrive(folderId);
		} catch(error) {
			console.log('[Gallery gapiInitHandler] error => ', error);
			this.setState({loading: false});
		}
	};

	getImagesFromGoogleDrive = async folderId => {
		const query = folderId ?
			`mimeType='image/jpeg' and '${folderId}' in parents and fullText contains '${config.FILE_PREFIX}' and trashed = false` :
			`mimeType='image/jpeg' and fullText contains '${config.FILE_PREFIX}' and trashed = false`;
		const response = await window.gapi.client.drive.files.list({
			'q': query,
			'fields': 'files(id, name, parents, createdTime)',
		});
		const images = response.result.files.map(file => ({
			id: file.id,
			src: `https://drive.google.com/uc?export=view&id=${file.id}`,
			dateTime: file.createdTime
		}));
		images.sort((a, b) => (a.dateTime < b.dateTime ? 1 : -1));
		this.setState({
			images: images,
			selectedStatusList: new Array(images.length).fill(false),
			loading: false
		});
	};

	toggleWidgetHandler = () => {
    this.setState(prevState => ({isGifWidgetOpen: !prevState.isGifWidgetOpen}));
	};

	imageClickHandler = index => {
		const { isGifWidgetOpen } = this.state;
		if (isGifWidgetOpen) {
			this.toggleImage(index);
		} else {
			this.showFullSizeImage(index);
		}
	};

	toggleImage = index => {
		const { selectedStatusList } = this.state;
		const newSelectedStatusList = [...selectedStatusList];
		newSelectedStatusList[index] = !newSelectedStatusList[index];
		this.setState({selectedStatusList: newSelectedStatusList});
	};

	showFullSizeImage = index => {
		this.openCloseImagesModal(true, index);
	};

	openCloseImagesModal = (isOpen, currentModalIndex=null) => {
		this.setState({isImagesModalOpen: isOpen, currentModalIndex});
	};

	toggleAllImagesHandler = event => {
		const { images } = this.state;
		const newSelectedStatusList = new Array(images.length).fill(event.target.checked);
		this.setState({
			selectedStatusList: newSelectedStatusList,
			allSelected: event.target.checked
		});
	};

	completionCallback = () => {
		this.setState({isProgressBarShown: false});
	};

	createGifHandler = width => {
		const { images, selectedStatusList } = this.state;
		const selectedImageList = images.filter((image, index) => selectedStatusList[index]);
		const selectedImageUrlList = selectedImageList.map(image => image.src);
		if (selectedImageUrlList.length > 0) {
			this.setState({isProgressBarShown: true});
			getMetaInfo(selectedImageUrlList[0], ratio => createGIF(selectedImageUrlList, this.completionCallback, width, width * ratio));
		}
	};

	render() {
		const {
			loading,
			images,
			isProgressBarShown,
			allSelected,
			selectedStatusList,
			isGifWidgetOpen,
			isImagesModalOpen,
			currentModalIndex
		} = this.state;
		return (
			<Fragment>
				<Grid container direction='column'>
					<Grid
						container
						direction='row'
						justify='space-between'
						alignItems='center'>
						<Logo />
						<GifGenWidget
							isOpen={isGifWidgetOpen}
							toggleWidget={this.toggleWidgetHandler}
							allSelected={allSelected}
							toggleAllImages={this.toggleAllImagesHandler}
							createGif={this.createGifHandler}
							disabled={isProgressBarShown} />
					</Grid>
					{ isProgressBarShown && <ProgressBar />}
					<Grid container justify='center'>
						<ImageList images={images} selectedStatusList={selectedStatusList} toggleHandler={this.imageClickHandler} />
						{ loading && <LoadingSpinner /> }
					</Grid>
				</Grid>
				<AdaptiveImagesModal
					images={images}
					isOpen={isImagesModalOpen}
					close={() => this.openCloseImagesModal(false)}
					currentIndex={currentModalIndex} />
			</Fragment>
		);
	}
}

export default Gallery;
// ray test touch >
