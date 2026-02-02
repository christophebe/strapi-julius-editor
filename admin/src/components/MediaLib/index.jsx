import React from 'react';
import { useStrapiApp } from '@strapi/strapi/admin';
import PropTypes from 'prop-types';

const prefixFileUrlWithBackendUrl = (url) => {
    if (!url) return url;

    if (/^(https?:)?\/\//i.test(url)) {
        return url;
    }

    const baseUrl = window.strapi?.backendURL || window.location.origin;
    const trimmedBaseUrl = baseUrl.replace(/\/$/, '');
    const path = url.startsWith('/') ? url : `/${url}`;

    return `${trimmedBaseUrl}${path}`;
};

const MediaLib = ({ isOpen, onChange, onToggle }) => {
    const components = useStrapiApp('MediaLib', (state) => state.components);
    const MediaLibraryDialog = components?.['media-library'];

    const handleSelectAssets = files => {
        const formattedFiles = files.map(f => ({
            ...f,
            alt: f.alternativeText || f.name,
            url: prefixFileUrlWithBackendUrl(f.url),
            mime: f.mime,
        }));

        onChange(formattedFiles);
    };

    if (!isOpen || !MediaLibraryDialog) {
        return null
    };

    return(
        <MediaLibraryDialog onClose={onToggle} onSelectAssets={handleSelectAssets} />
    );
};

MediaLib.defaultProps = {
    isOpen: false,
    onChange: () => {},
    onToggle: () => {},
};

MediaLib.propTypes = {
    isOpen: PropTypes.bool,
    onChange: PropTypes.func,
    onToggle: PropTypes.func,
};

export default MediaLib;
