import {Controller, Get, Req} from '@nestjs/common';
import {Request} from 'express';

@Controller('test')
export class TestController {
    @Get()
    findAll(@Req() request: Request) {
        return {blaine: 'modulo', other: [123, 345, 125], new: 'whhhaa', old: {qwe: 123, asd: ['eee', 'ere']}};
        // return 'sumtin';
    }
}
