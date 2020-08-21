import React, { useState, useCallback, useEffect } from 'react'
import { css } from '@emotion/core'
import { useDropzone } from 'react-dropzone'
import { FaWindowClose } from 'react-icons/fa'
import loadable from '@loadable/component'
import axios from 'axios'

import { colors } from '../../styles/variables'

const AsyncInput = loadable(props => import(`./${props.type || `File`}`), {
  cacheKey: props => props.type,
})

const fileUpload = async (file, mediaType) => {
	const prURL = `https://api.cloudinary.com/v1_1/powerreviews/auto/upload`

	const formData = new FormData();
	formData.append(`upload_preset`, mediaType === `video` ? `prod_video_preset` : `prod_preset`);
	formData.append(`file`, file);

	const { data } = await axios({
		method: `POST`,
		url: prURL,
		data: formData
	})

	return data
}

const createFileObj = (data, field) => {
	const { composite_type, field_type, id, key, fields } = field
	const { height, width, secure_url, public_id, bytes } = data
	return {
		composite_data: {
			raw: {
				height,
				publicId: public_id,
				size: bytes / 1000,
				url: secure_url,
				width,
			}
		},
		composite_type,
		field_type,
		id,
		key,
		fields,
	}
}

export default function File(props){
	const { field, onChange, ...rest } = props
	const { composite_type, fields } = field 

	const [files, setFiles] = useState([])
	const [loading, setLoading] = useState(false)
	const [errors, setErrors] = useState([])

	useEffect(() => {
		const updatedFiles = files.map((file, i) => ({...file, key: `${file.key}_${i}`}))
		onChange(updatedFiles, true)
	}, [files])
	
	const mediaType = composite_type === `Image` ? `image` : `video`

	const onDrop = useCallback(async (acceptedFiles) => {
		// Do something with the files
		const fileReq = []

		// only allow accepted media type
		acceptedFiles.forEach(file => {
			if(file?.type?.indexOf(mediaType) > -1){
				fileReq.push(fileUpload(file, mediaType))
			} else {
				setErrors([...errors, file?.name])
			}
		})

		if(fileReq.length){
			setLoading(true)
			// get all image uploads
			const fileRes = await Promise.all(fileReq)

			// create image objects for review
			fileRes.forEach(data => {
				const imgObj = createFileObj(data, field, files.length)

				setFiles([...files, imgObj])
			})
			setLoading(false)
		}
		
	}, [files])

	// remove file from selection
	const handleFileRemove = (idx) => {
		setFiles([...files.slice(0, idx), ...files.slice(idx + 1)])
	}

	// update fields on each file
	const handleFileField = (value, field, idx) => {
		// find the correct file obj
		const updatedFile = { ...files[idx] }

		// find the correct field in that obj
		const foundFieldIdx = updatedFile?.fields?.findIndex(({ key }) => key === field?.key)
		
		if(foundFieldIdx > -1) {
			// if the field exist then update the value
			const foundField = { 
				...updatedFile?.fields?.[foundFieldIdx],
				value,
			 }

			updatedFile.fields = [
				...updatedFile.fields.slice(0, foundFieldIdx),
				foundField,
				...updatedFile.fields.slice(foundFieldIdx + 1)
			]
		} else {
			// otherwise create a new field
			const fieldValue = {
				...field,
				value,
			}
			if(updatedFile.fields) {
				updatedFile.fields = [...updatedFile.fields, fieldValue]
			} else {
				updatedFile.fields = [fieldValue]
			}
		}

		setFiles([ ...files.slice(0, idx), updatedFile, ...files.slice(idx + 1) ])
	}

	const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })

	return (
		<div css={styles} {...rest}>
			{!!errors.length && (
				<div className="errorImages">
					{mediaType}(s) are not valid: {errors.join(`,`)}
				</div>
			)}
			<div className={`dropzone`} {...getRootProps()}>
				<input {...getInputProps()} />
				{
					isDragActive ?
						<p>Drop the file here ...</p> :
						<p>Drag 'n' drop or click</p>
				}
			</div>
			{loading && <div className={`loading`}>Uploading File...</div>}
			<ul className="mediaList">
				{files?.map?.((file, i) => {
					const src = file?.composite_data?.raw?.url
					return (
						<li 
							key={i} 
							className={`mediaItem`}
						>
							<div className="row">
								{mediaType === `image` 
									? <img className={`media`} src={src} /> 
									: (
										<video className={`media`} controls>
											<source src={src} />
											Sorry, your browser doesn't support embedded videos.
										</video>
									)}
								<div className={`removeContainer`}>
									<FaWindowClose className={`remove`} onClick={() => handleFileRemove(i)} />
								</div>
							</div>

							<div className="row">
								{fields?.map?.((f, idx) => {
									const { input_type, key, label, prompt, ...restField } = f

									return (
										<div className="field" key={`${idx}-${key}`}>
											<label className="fieldLabel" htmlFor={key}>{label || prompt}</label>
											<AsyncInput 
												type={input_type}
												field={restField}
												onChange={(val) => handleFileField(val, f, i)}
											/>
										</div>
									)
								})}
							</div>
						</li>
					)
				})}
			</ul>
		</div>
		
	)
}

const styles = css`
	.loading {
		margin: 20px;
	}
	.errorImages {
		color: red;
		margin: 20px 0;
	}
	.dropzone {
		border: 1px solid #333;
		padding: 20px;
		cursor: pointer;
		border-radius: 5px;
	}
	.mediaList {
		list-style: none;
    display: flex;
    flex-flow: column nowrap;
		align-items: center;
    padding: 0;
		margin: 10px -10px;
		.mediaItem {
			margin: 10px;
			position: relative;
			display: flex;
			flex-flow: row wrap;
			justify-content: center;
			align-items: center;
			text-align: center;
			.row {
				flex: 1 0 100%;
			}
			.remove {
				cursor: pointer;
				height: 40px;
				width: 40px;
			}
			.removeContainer {
				display: flex;
				justify-content: center;
				align-items: center;
				margin: 10px;
			}
			.media {
				/* width: 100% !important; */
				height: 100% !important;
				max-height: 200px;
				max-width: 200px;
				outline: none;
				border: none;
			}
		}
	}
`