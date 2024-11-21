import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Friends } from '..';
import { FriendStatusEnum } from 'src/shared/enums';
import {
  UpdateFriendStatusDto,
  RemoveFriendDto,
  FilterFriendDto,
  SortFriendDto,
} from './dto';
import { IPaginationOptions } from 'src/shared/types';

@Injectable()
export class FriendsModel {
  constructor(
    @InjectModel(Friends.name)
    private readonly friendsModel: Model<Friends>,
  ) {}

  /**
   * This TypeScript function retrieves friends by user ID and optional statuses.
   * @param {string} senderId - The `senderId` parameter is a string representing the ID of the user
   * for whom you want to retrieve friends.
   * @param {FriendStatusEnum | FriendStatusEnum[]} [statuses] - The `statuses` parameter in the
   * `getFriendsByUserId` function is an optional parameter that can be either a single
   * `FriendStatusEnum` value or an array of `FriendStatusEnum` values. It is used to filter the
   * friends based on their status. If `statuses` is provided and
   * @returns The function `getFriendsByUserId` returns a Promise that resolves to an array of
   * `Friends` objects based on the `senderId` and optional `statuses` provided as parameters. If
   * `statuses` is provided and is an array with length greater than 0, the function filters the
   * `Friends` based on the `senderId` and matching `status` values from the `statuses` array
   */
  async getFriendsByUserId(
    senderId: string,
    statuses?: FriendStatusEnum | FriendStatusEnum[],
  ): Promise<Friends[]> {
    if (statuses && statuses.length) {
      return this.friendsModel.find({
        senderId,
        status: { $in: statuses },
      });
    }

    return this.friendsModel.find({ senderId });
  }

  /**
   * This TypeScript function retrieves a list of friends by receiverId and optional statuses.
   * @param {string} receiverId - The `receiverId` parameter is a string representing the user ID for
   * which we want to retrieve followers.
   * @param {FriendStatusEnum | FriendStatusEnum[]} [statuses] - The `statuses` parameter in the
   * `getFollowersByUserId` function is used to filter the results based on the status of the friends. It
   * can accept either a single `FriendStatusEnum` value or an array of `FriendStatusEnum` values. If
   * provided, the function will only return
   * @returns The function `getFollowersByUserId` returns a Promise that resolves to an array of
   * `Friends` objects based on the provided `receiverId` and optional `statuses` parameter. If
   * `statuses` is provided and is an array with length greater than 0, the function filters the results
   * based on the `receiverId` and the specified `statuses`. Otherwise, it returns all `Friends`
   */
  async getFollowersByUserId(
    receiverId: string,
    statuses?: FriendStatusEnum | FriendStatusEnum[],
  ): Promise<Friends[]> {
    if (statuses && statuses.length) {
      return this.friendsModel.find({
        receiverId,
        status: { $in: statuses },
      });
    }

    return this.friendsModel.find({ receiverId });
  }

  /**
   * The function `findExistingFriend` searches for a friend relationship based on sender and receiver
   * IDs, with an optional status filter.
   * @param {string} senderId - The `senderId` parameter is a string representing the ID of the user who
   * is sending the friend request.
   * @param {string} receiverId - The `receiverId` parameter in the `findExistingFriend` function
   * represents the unique identifier of the user who is the intended recipient of the friend request or
   * relationship. This parameter is used to search for existing friend connections between the sender
   * (identified by `senderId`) and the receiver in the database.
   * @param {FriendStatusEnum} [status] - The `status` parameter in the `findExistingFriend` function is
   * an optional parameter of type `FriendStatusEnum`. It is used to filter the search for a friend
   * based on their status. If a `status` value is provided, the function will include it in the query
   * to find a friend
   * @returns The `findExistingFriend` function returns a Promise that resolves to either a `Friends`
   * object or `null`.
   */
  async findExistingFriend(
    senderId: string,
    receiverId: string,
    status?: FriendStatusEnum,
  ): Promise<Friends | null> {
    const query = { senderId, receiverId };
    if (status) query['status'] = status;
    return this.friendsModel.findOne(query);
  }

  /**
   * The function `createNewFriendRequest` creates a new friend request with the specified sender and
   * receiver IDs and a default status of "FOLLOWING".
   * @param {string} senderId - The `senderId` parameter in the `createNewFriendRequest` function
   * represents the unique identifier of the user who is sending the friend request.
   * @param {string} receiverId - The `receiverId` parameter in the `createNewFriendRequest` function
   * represents the unique identifier of the user who will receive the friend request. This parameter is
   * a string type and is used to specify the user to whom the friend request will be sent.
   * @param status - The `status` parameter in the `createNewFriendRequest` function is set to a default
   * value of `FriendStatusEnum.FOLLOWING` if no value is provided when calling the function. This means
   * that if the `status` parameter is not explicitly passed when calling the function, it will default
   * @returns The `createNewFriendRequest` function returns a Promise that resolves to a new friend
   * request object (of type `Friends`) after saving it to the database. The object is converted to a
   * plain JavaScript object using `toObject()` before being returned.
   */
  async createNewFriendRequest(
    senderId: string,
    receiverId: string,
    status = FriendStatusEnum.FOLLOWING,
  ): Promise<Friends> {
    const newFriend = new this.friendsModel({
      senderId,
      receiverId,
      status,
    });

    return (await newFriend.save()).toObject();
  }

  /**
   * This TypeScript function updates the status of a friend relationship in a database based on the
   * sender and receiver IDs provided in the DTO.
   * @param {UpdateFriendStatusDto} dto - The `dto` parameter in the `updateFriendStatus` function is an
   * object of type `UpdateFriendStatusDto`. It likely contains the following properties:
   * @returns The `updateFriendStatus` function is returning a Promise that resolves to a `Friends`
   * object. The function updates the friend status in the database using the `findOneAndUpdate` method
   * of the `friendsModel` by finding a document that matches the senderId and receiverId specified in
   * the `UpdateFriendStatusDto` object (`dto`) and setting the status to the value provided in the
   * `dto.status
   */
  async updateFriendStatus(dto: UpdateFriendStatusDto): Promise<Friends> {
    return this.friendsModel.findOneAndUpdate(
      { senderId: dto.senderId, receiverId: dto.receiverId },
      { $set: { status: dto.status } },
      { new: true, lean: true },
    );
  }

  /**
   * The function `removeFriend` asynchronously removes a friend from the `Friends` collection based on
   * the provided `RemoveFriendDto`.
   * @param {RemoveFriendDto} dto - The `dto` parameter in the `removeFriend` function likely stands for
   * Data Transfer Object. It is an object that contains the necessary data for removing a friend, such
   * as the friend's ID or any other relevant information needed to perform the removal operation.
   * @returns The `removeFriend` function is returning a Promise that resolves to a `Friends` object
   * after deleting a friend record based on the provided `RemoveFriendDto` data.
   */
  async removeFriend(dto: RemoveFriendDto): Promise<Friends> {
    return this.friendsModel.findOneAndDelete(dto);
  }

  /**
   * The `searchFriends` function in TypeScript searches for friends based on a query, user ID, and
   * optional statuses.
   * @param {string} query - The `query` parameter is a string used for searching friends based on a
   * specific criteria or keyword.
   * @param {string} userId - The `userId` parameter in the `searchFriends` function represents the
   * unique identifier of the user for whom you are searching friends. This parameter is used to filter
   * the search results based on the specified user ID.
   * @param {FriendStatusEnum | FriendStatusEnum[]} [statuses] - The `statuses` parameter in the
   * `searchFriends` function is used to filter the search results based on the status of the friends. It
   * can accept a single `FriendStatusEnum` value or an array of `FriendStatusEnum` values. If provided,
   * the function will include only the friends with
   * @returns The `searchFriends` function returns a Promise that resolves to an array of `Friends`
   * objects based on the search criteria provided in the function parameters. The search criteria
   * include the `query` string, the `userId` string, and optionally the `statuses` array of
   * `FriendStatusEnum` values. The function searches for friends where the `senderId` or `receiverId`
   * matches the `
   */
  async searchFriends(
    query: string,
    userId: string,
    statuses?: FriendStatusEnum | FriendStatusEnum[],
  ): Promise<Friends[]> {
    const searchQuery = {
      $or: [
        { senderId: userId, receiverId: { $regex: query, $options: 'i' } },
        { receiverId: userId, senderId: { $regex: query, $options: 'i' } },
      ],
    };

    if (statuses && statuses.length) {
      searchQuery['status'] = { $in: statuses };
    }

    return this.friendsModel.find(searchQuery);
  }

  /**
   * This function retrieves pending friend requests sent to a specific user.
   * @param {string} senderId - The `senderId` parameter in the `getPendingRequests` function is a string
   * that represents the ID of the user who sent the friend request. This function retrieves a list of
   * pending friend requests where the `receiverId` matches the `senderId` and the status is set to
   * `PENDING
   * @returns This function returns a Promise that resolves to an array of Friends objects representing
   * pending friend requests where the receiverId matches the provided senderId and the status is set to
   * "PENDING".
   */
  async getPendingRequests(senderId: string): Promise<Friends[]> {
    return this.friendsModel.find({
      receiverId: senderId,
      status: FriendStatusEnum.PENDING,
    });
  }

  /**
   * This function retrieves friend requests for a specific receiver based on their ID.
   * @param {string} receiverId - The `receiverId` parameter is a string that represents the unique
   * identifier of the user who is receiving friend requests.
   * @returns An array of friend requests that have the receiverId matching the input parameter and have
   * a status of "PENDING".
   */
  async getFriendRequests(receiverId: string): Promise<Friends[]> {
    return this.friendsModel.find({
      receiverId,
      status: FriendStatusEnum.PENDING,
    });
  }

  /**
   * Note: Not implemented in the service layer yet as it is not used
   * @param filterOptions - Filter options
   * @param sortOptions - Sort options
   * @param paginationOptions - Pagination options
   * @returns List of friends with pagination information
   */
  async findManyWithPagination({
    filterOptions,
    sortOptions,
    paginationOptions,
  }: {
    filterOptions?: FilterFriendDto | null;
    sortOptions?: SortFriendDto[] | null;
    paginationOptions: IPaginationOptions;
  }): Promise<Friends[]> {
    console.log(filterOptions, sortOptions, paginationOptions);
    return this.friendsModel
      .find()
      .sort()
      .skip((paginationOptions.page - 1) * paginationOptions.limit)
      .limit(paginationOptions.limit);
  }
}
