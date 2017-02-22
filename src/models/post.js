import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate';
import { Category } from './category';
import { Tag } from './tag';

const postSchema = new mongoose.Schema({
    url: String,
    title: String,
    content: String,
    author: String,
    category: String,
    tags: { type: Array, default: [] },
    views: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
});

postSchema.plugin(mongoosePaginate);

postSchema.statics.findByCate = async function(cateUrl, page=1) {
    let cate = { category: cateUrl };

    if (cateUrl) {
        let res = await Category.findByUrl(cateUrl);

        if (res.status === 'error') {
            return res;
        }
    } else {
        cate = {};
    }

    return this.paginate(cate, {
        page,
        limit: 15,
        sort: { createdAt: -1 },
    });
};

postSchema.statics.findByTag = async function(tag, page=1) {
    if (tag) {
        let res = await Tag.findByName(tag);
        if (res.status === 'error') {
            return res;
        }
    }

    return this.paginate({ tags: { $in: [tag] }}, {
        page,
        limit: 15,
        sort: { cratedAt: -1 },
    });
};

postSchema.statics.findByUrl = async function(url) {
    let post = await this.findOne({ url });

    if (post) {
        post.views++;
        post.save();
        return { post };
    }
    return { status: 'error', msg: '没有找到相关文章' };
};

postSchema.statics.add = async function(post) {
    let posts = await this.find({});
    post.url = posts.length + 1 + '';

    await post.save();
    return {
        status: 'success',
        msg: '文章发布成功',
        post,
    };
};

postSchema.statics.edit = async function(post) {
    await this.update({ url: post.url }, { $set: { ...post } });

    return {
        status: 'success',
        msg: '文章更新成功',
        post,
    };
};

let Post = mongoose.model('Post', postSchema);

export { Post }

