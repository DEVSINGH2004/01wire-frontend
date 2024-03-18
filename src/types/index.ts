interface ErrorResponse {
  error: boolean;
  message: string;
}

export interface SpamSenderInfo {
  id: string;
  firstName: string;
  lastName: string;
  profilePhotoId: string;
}

export interface PoolStatsType {
  unread: number;
  starred: number;
}

export type Pool = {
  id: string;
  clientId: string;
  userId: string;
  title: string;
  type: string;
  status: string;
  labels: string[];
  stats: PoolStatsType;
  spamSenderIds: string[];
  isSpreadSheetEnabled: boolean;
  spamSenderInfo: SpamSenderInfo[];
  keywordIds: string[];
  chatIds: string[];
  chatInfo: Chat[];
  isApproved: boolean;
  createdAt: string;
  updatedAt: string;
};

export type PoolsData = {
  data: Pool[];
  paginationInfo: PaginationInfo;
};

export type PoolInfoType = {
  id: string;
  title: string;
};
export type MsgContentWebpageType = {
  url: String;
  siteName: String;
  type: String;
  title: String;
  description: String;
};

export type ContentType = {
  text: string;
  webPage: MsgContentWebpageType;
};
export type SenderInfoType = {
  _id: string;
  firstName: string;
  lastName: string;
  profilePhotoId: string;
};

export type ArticleMediaContactType = {
  name: string;
  email: string;
  phone: string;
  website: string;
  address: string;
  state: string;
  country: string;
  facebook: string;
  instagram: string;
  linkedIn: string;
  twitter: string;
  youtube: string;
  others: string;
};

export type ArticleType = {
  id: string;
  userId: string;
  clientId: string;
  language: string;
  title: string;
  content: string;
  summary: string;
  featureImage: string;
  featureImageDesc: string;
  articleImages: string[];
  status: string;
  category: string;
  publishType: string;
  timezone: string;
  notes: string;
  bundleIds: string[];
  publicationIds: string[];
  mediaContact: ArticleMediaContactType;
  publishAt: string;
  createdAt: string;
  updatedAt: string;
};

export interface ArticleData {
  data: ArticleType[];
  paginationInfo: PaginationInfo;
}

export type ClientSocialType = {
  facebook: string;
  instagram: string;
  linkedIn: string;
  twitter: string;
  youtube: string;
  others: string;
};

export type Client = {
  id: string;
  userId: string;
  title: string;
  type: string;
  category: string;
  email: string;
  website: string;
  ticker: string;
  logo: string;
  social: ClientSocialType;
  createdAt: string;
  updatedAt: string;
};

export type ClientData = {
  data: Client[];
  paginationInfo: PaginationInfo;
};
type PublicationStatsType = {
  da: number;
  pa: number;
  dr: number;
  ur: number;
  traffic: number;
};
type BundlePublicationInfoType = {
  id: string;
  title: string;
  image: string;
  stats: PublicationStatsType;
  categories: string[];
  linkType: string;
  url: string;
  timeline: string;
  price: number;
  createdAt: string;
  updatedAt: string;
};
export type Bundle = {
  id: string;
  publicationIds: string[];
  image: string;
  description: string;
  type: string;
  category: string;
  traffic: string;
  price: number;
  createdAt: string;
  updatedAt: string;
  publicationInfo: BundlePublicationInfoType;
};
export type BundleData = {
  data: Bundle[];
  paginationInfo: PaginationInfo;
};
export type Publication = {
  id: string;
  title: string;
  image: string;
  stats: PublicationStatsType;
  categories: string[];
  linkType: string;
  url: string;
  timeline: string;
  price: number;
  createdAt: string;
  updatedAt: string;
};
export type PublicationData = {
  data: Publication[];
  paginationInfo: PaginationInfo;
};
export type PaginationInfo = {
  currentPage: number;
  perPage: number;
  itemCount: number;
  pageCount: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
};

export type FetchClientDataResponse = ClientData | ErrorResponse;

export interface Chat {
  id: number;
  title: string;
  type: string;
}

export interface ChatIDsData {
  chatTypePrivate: Chat[];
  chatTypeBasicGroup: Chat[];
  chatTypeSupergroup: Chat[];
}

export type FetchChatIDsResponse = ChatIDsData | ErrorResponse;

interface PoolData {
  data: Pool[];
  paginationInfo: PaginationInfo;
}

export type FetchPoolResponse = PoolData | ErrorResponse;

interface PoolInfo {
  _id: string;
  title: string;
}

interface Content {
  text: string;
}

interface MsgInfo {
  _id: string;
  link: string | null;
  isLinkPublic: boolean;
  content: Content;
}

interface KeywordInfo {
  _id: string;
  title: string;
}

interface ChatInfo {
  _id: string;
  title: string;
}

interface SenderInfo {
  _id: string;
  firstName: string;
  lastName: string;
}

interface ClientInfo {
  _id: string;
  title: string;
}

export interface User {
  _id: string;
  userId: string;
  msgId: string;
  clientId: string;
  poolId: string;
  chatId: string;
  senderId: string;
  keywordId: string;
  keyword: string;
  status: string;
  deletedAt: string | null;
  __v: number;
  createdAt: string;
  updatedAt: string;
  poolInfo: PoolInfo[];
  msgInfo: MsgInfo[];
  keywordInfo: KeywordInfo[];
  chatInfo: ChatInfo[];
  senderInfo: SenderInfo[];
  clientInfo: ClientInfo[];
}

interface UserData {
  data: User[];
  paginationInfo: PaginationInfo;
}

export type FetchUserResponse = UserData | ErrorResponse;
export type UpdatePoolData = Pool | ErrorResponse;

export interface PaginationInput {
  currentPage: number;
  perPage: number;
}
