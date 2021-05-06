import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {withFormik} from 'formik';
import {translate} from '@gqlapp/i18n-client-react';
import {FieldAdapter as Field} from '@gqlapp/forms-client-react';
import {required, validate} from '@gqlapp/validation-common-react';
import {Form, RenderField, Button} from '@gqlapp/look-client-react';
import ImageUpload from '@gqlapp/look-client-react/ui-bootstrap/components/custom/ImageUpload';

const postFormSchema = {
    title: [required],
    content: [required]
};

const PostForm = ({values, handleSubmit, submitting, t}) => {
    const originalValues = {...values};
    const [imageBase64, setImageBase64] = useState(originalValues.imageBase64);

    useEffect(() => {
        values.imageBase64 = imageBase64;
        //Set values.imageBase64 so formik can extract it -otherwise would have used imageBase64 react state var directly.
    }, [imageBase64]);

    return (
        <Form name="post" onSubmit={handleSubmit}>
            <Field name="title" component={RenderField} type="text" label={t('post.field.title')} value={values.title}/>
            <Field
                name="content"
                component={RenderField}
                type="text"
                label={t('post.field.content')}
                value={values.content}
            />
            <div style={{display: "none"}}>
                <Field
                    name="imageBase64"
                    component={RenderField}
                    type="text"
                    label={"Post Image"}
                    value={imageBase64}
                    //If a new image is selected, take it, otherwise the one received originally.
                />
            </div>
            <ImageUpload onImageBase64Change={imageBase64 => {
                console.log("image upload event fired");
                if(imageBase64) {
                    setImageBase64(imageBase64);
                }else{
                    setImageBase64(originalValues.imageBase64);
                }
            }}/>
            <Button color="primary" type="submit" disabled={submitting}>
                {t('post.btn.submit')}
            </Button>
        </Form>
    );
};

PostForm.propTypes = {
    handleSubmit: PropTypes.func,
    onSubmit: PropTypes.func,
    submitting: PropTypes.bool,
    values: PropTypes.object,
    post: PropTypes.object,
    t: PropTypes.func
};

const PostFormWithFormik = withFormik({
    mapPropsToValues: props => ({
        title: props.post && props.post.title,
        content: props.post && props.post.content,
        imageBase64: props.post && props.post.imageBase64
    }),
    validate: values => validate(values, postFormSchema),
    handleSubmit(
        values,
        {
            props: {onSubmit}
        }
    ) {
        onSubmit(values);
    },
    enableReinitialize: true,
    displayName: 'PostForm' // helps with React DevTools
});

export default translate('post')(PostFormWithFormik(PostForm));
