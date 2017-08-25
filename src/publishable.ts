import { InitMessage } from "./init-message"

export type Jpeg       = {type: "image/jpeg",               extension: "jpg"  }
export type Csv        = {type: "text/csv",                 extension: "csv"  }
export type Binary     = {type: "application/octet-stream", extension: "bin"  }
export type Json       = {type: "application/json",         extension: "json" }

export type RepresentationType = Jpeg | Csv | Binary | Json

export type Url            = string

export interface Representation {
  type: RepresentationType
  dataUrl: Url
}

export interface LaunchApplication {
  launchUrl: Url
  name: string
}

export const PublishMessageName = "SharinatorPublish"
export const PublishResponseMessageName = "SharinatorPublishResponse"

export interface Publishable {
  context: InitMessage
  createdAt: Date
  application: LaunchApplication
  representations: Representation[]
}
