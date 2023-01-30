const template = ({text,data}) => {
    try {
        text = text ? text.toString().trim() : '';
        const reDeleteKeyMark = /([{} ])*/g;
        // const reFindKey = /{{([\s\S]+?)}}/g;
        if (text && typeof(text) === 'string') {
            Object.keys(data).forEach(key=> {
                const re = new RegExp(`{{${key}}}`,g);
                text = text.replace(re,data[key])
            });
        } 
        return text;
    } catch(e) {
        console.log(e);
        return ''
    }
}