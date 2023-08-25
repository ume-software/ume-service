import { ApiModel, ApiModelProperty } from "express-swagger-typescript";

@ApiModel({
  description: "User Information response",
})
export class UserInformationResponse {
  @ApiModelProperty({
    description: "User name",
    required: true,
    example: "Đỗ Trần Minh Chu",
  })
  name!: string;


  @ApiModelProperty({
    description: "User name",
    required: true,
    example: "Đỗ Trần Minh Chu",
  })
  username!: string;

  @ApiModelProperty({
    description: "Slug",
    required: true,
    example: "do-tran-minh-chu",
  })
  slug!: string;

  @ApiModelProperty({
    description: "Dob timezone 0",
    required: true,
    example: "2001-10-12 17:00:00.000",
  })
  dob!: string;

  @ApiModelProperty({
    description: "Gender",
    required: true,
    example: "MALE",
  })
  gender!: string;

  @ApiModelProperty({
    description: "Phone number",
    example: "0123456789",
  })
  phone!: string;

  @ApiModelProperty({
    description: "Email",
    required: true,
    example: "dotranminhchu@gmail.com",
  })
  email!: string;

  @ApiModelProperty({
    description: "avatarUrl",
    required: true,
    example: "https://haycafe.vn/wp-content/uploads/2022/02/anh-meo-cute-hinh-cute-meo.jpg",
  })
  avatarUrl!: string;
}