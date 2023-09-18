const https = require("https");
const postHandler = {}

// Fungsi ini mengambill daftar post dari URL yang diberikanz
postHandler.getAllPost = (req, res) => {
    https.get("https://jsonplaceholder.typicode.com/posts", (response) => {
        let data = "";

        response.on("data", (chunk) => {
            data += chunk;
        });

        response.on("end", () => {
            // Parsing data JSON yang diterima
            const posts = JSON.parse(data);
            const postsTransformed = posts.map((post) => ({
                userId: post.userId,
                postId: post.id,
                judulPost: post.title,
                content: post.body,
            }));

            // Mengirim respons HTTP dengan format JSON
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify(postsTransformed, null, 2));
            // res.writeHead(200, "OK")
            // res.end("Hallo !")
        });
    });
};

// Fungsi ini mengambil daftar Comment dari URL yang diberikan
postHandler.getAllComments = (req, res) => {
    https.get("https://jsonplaceholder.typicode.com/comments", (response) => {
        let data = "";

        response.on("data", (chunk) => {
            data += chunk;
        });

        response.on("end", () => {
            // Parsing data JSON yang diterima
            const comments = JSON.parse(data);

            const formattedComments = comments.map((comment) => ({
                postId: comment.postId,
                name: comment.name,
                email: comment.email,
                content: comment.body,
            }));

            // Mengirim respons HTTP dengan format JSON
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify(formattedComments, null, 2));
        });
    });
};

// Fungsi ini menggabungkan data postingan dan komentarr
postHandler.getAllPostAndComments = (req, res) => {
    // Mengambil data dari daftar post
    https.get("https://jsonplaceholder.typicode.com/posts", (postResponse) => {
        let postData = "";

        postResponse.on("data", (chunk) => {
            postData += chunk;
        });

        postResponse.on("end", () => {
            // Parsing data JSON yang diterima
            const posts = JSON.parse(postData);

            // Mengambil data dari daftar comment
            https.get("https://jsonplaceholder.typicode.com/comments", (commentResponse) => {
                let commentData = "";

                commentResponse.on("data", (chunk) => {
                    commentData += chunk;
                });

                commentResponse.on("end", () => {
                    // Parsing data JSON yang diterima
                    const comments = JSON.parse(commentData);

                    // Menggabungkan postingan dan komentar
                    const result = posts.map((post) => {
                        const postComments = comments
                            .filter((comment) => comment.postId === post.id)
                            .slice(1);

                        return {
                            id: post.id,
                            judulPost: post.title,
                            contentPost: post.body,
                            comments: postComments.map((comment) => ({
                                postId: comment.postId,
                                namaUser: comment.name,
                                emailUser: comment.email,
                                contentComment: comment.body,
                            })),
                        };
                    });

                    // Mengirim respons HTTP dengan format JSON
                    res.writeHead(200, { "Content-Type": "application/json" });
                    res.end(JSON.stringify(result, null, 2));
                });
            });
        });
    });
};

module.exports = postHandler