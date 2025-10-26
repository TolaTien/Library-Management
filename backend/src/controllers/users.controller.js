const User = require('../models/users.model')
const { createRefreshToken, createToken, verifyToken } = require('../services/tokenServices');

const bcrypt = require('bcrypt')
const CryptoJS = require('crypto-js')
require('dotenv').config();

class CotrollerUser {
    // Đăng ký
    async registerUser(req, res) {
        try{
            const { fullName, phone, address, email, password } = req.body;
            if(!fullName || !email || !password) {
                return res.status(400).json({message: "Vui lòng nhập đầy đủ thông tin"});
            }

            const existingUser = await User.findOne({where: email});
            if(existingUser) {
                return req.status(400).json({message: "Email đã tồn tại"});
            }
            const salt = bcrypt.genSaltSync(10);
            const passHash = bcrypt.hashSync(password, salt);

            const newUser = await User.create({
                fullName,
                phone,
                address,
                email,
                password: passHash,
            });

            const token = await createToken({id: newUser.id});
            const refreshToken = await createRefreshToken({id: newUser.id});
            
            res.cookie('token', token, {
                httpOnly: true,
                secure: true,
                sameSite: 'Strict',
                maxAge: 15 * 60 *1000
            });
            res.cookie('logged', 1, {
                httpOnly: false,
                secure: true,
                sameSite: 'Strict',
                maxAge: 7 * 24 * 60 * 60 * 1000
            });
            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                secure: true,
                sameSite: 'Strict',
                maxAge: 7 * 24 * 60 * 60 * 1000
            });
            return res.status(201).json( {status: 'success', message: 'Đăng ký thành công', data: {token, refreshToken}})
        }catch(err) {
            console.error(err);
            return res.status(500).json({ message: 'Lỗi server'});
        }

    }

    // Đăng nhập

    async login(req, res) {
        try {
            const { email, password } = req.body;
            if(!email || !password ) return res.status(400).json({ message: "Vui lòng nhập đầy đủ thông tin"});

            if( email === 'admin@gmail.com' && password === '123456' ) {
                return res.status(200).json({
                    status: 'success',
                    message: 'Đăng nhập admin thành công!',
                    data: { redirectTo: '/admin' }
                });
            }
            const findUser = await User.findOne({ where: email });
            if(!findUser) return res.status(401).json({message: "Tài khoản hoặc mật khẩu không chính xác"});
            const pass = bcrypt.compareSync(password, findUser.password);
            if( !pass ) return res.status(401).json({ message: 'Tài khoản hoặc mật khẩu không hợp lệ'});

            const token = await createToken({ id: findUser.id });
            const refreshToken = await createRefreshToken({ id: findUser.id });
            res.cookie('token', token, { 
                httpOnly: true, 
                secure: true, 
                sameSite: 'Strict' 
            });
            res.cookie('refreshToken', refreshToken, { 
                httpOnly: true, 
                secure: true, 
                sameSite: 'Strict' 
            });
            res.cookie('logged', 1, { 
                httpOnly: false, 
                secure: true, 
                sameSite: 'Strict' 
            });
            return res.status(200).json({
                status: 'success',
                message: 'Đăng nhập thành công',
                data: {token, refreshToken, redirectTo: '/'},
            });
        }catch(err){
            console.error(err);
            return res.status(500).json({ message: 'Lỗi server'});
        }
    }

    // Xác thực
    async authUser(req, res) {
        try {
            const { id } = req.user;
            const findUser = await User.findOne({ where: id });
            if( !findUser ) return res.status(401).json({ message: "Tài khoản không tồn tại" });

            const encrypt = CryptoJS.AES.encrypt(JSON.stringify(findUser), process.env.SECRET_CRYPTO).toString();
            return res.status(200).json({ status: 'success', message: 'success', data: encrypt });
        }catch(err){
            console.error(err);
            return res.status(500).json({ message: 'Lỗi server'});
        }
    }

    // RefreshToken
    async refreshToken(req, res) {
        try {
            const refreshToken = req.cookies.refreshToken;
            if (!refreshToken) return res.status(401).json({ message: 'Không tìm thấy refresh token' });

            const decoded = await verifyToken(refreshToken);
            const user = await modelUser.findOne({ where: { id: decoded.id } });
            const token = await createToken({ id: user.id });

            res.cookie('token', token, { httpOnly: true, secure: true, sameSite: 'Strict' });
            return res.status(200).json({ status: 'success', message: 'Làm mới token thành công', data: { token } });
        } catch (error) {
            return res.status(500).json({ message: 'Lỗi server' });
        }
    }

    // Đăng xuất
    async logout(req, res){
        res.clearCookie('token');
        res.clearCookie('refreshToken');
        res.clearCookie('logged');
        return res.status(200).json({status: 'success', message: 'Bạn đã đăng xuất'});
    }

    



}