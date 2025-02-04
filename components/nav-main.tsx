"use client"

import { ChevronRight, type LucideIcon } from "lucide-react"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import React from "react"
import Link from "next/link"



export function NavMain({
  items,
}: {
  items: {
    title: string
    url: string
    icon?: React.ReactElement;
    isActive?: boolean
    items?: {
      title: string
      url: string
    }[]
  }[]
}) {
  return (

    <SidebarGroup >
      <SidebarMenu >
        {items.map((item) => (
          <Collapsible
            key={item.title}
            asChild
            defaultOpen={item.isActive}
            className="group/collapsible"
          >
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton tooltip={item.title}>

                  {/* single sidebar menu which rendering and using next link so possible when click on specific menu render at specific page */}
                  <Link href={item.url} className="flex space-x-3 items-center w-full">
                  {/* //increse icon size */}
                    <h1>{item.icon && (
                       <span style={{ fontSize: "18px" }}>  
                        {item.icon}
                      </span>
                    )}</h1>
                    <span>{item.title}</span>
                  </Link>

                  {/* <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" /> */}
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenuSub>
                  {item.items?.map((subItem) => (
                    <SidebarMenuSubItem key={subItem.title}>
                      <SidebarMenuSubButton asChild>
                        <a href={subItem.url}>
                          <span>{subItem.title}</span>
                        </a>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  ))}
                </SidebarMenuSub>
              </CollapsibleContent>
            </SidebarMenuItem>
          </Collapsible>
        ))}
      </SidebarMenu>
    </SidebarGroup>

  )
}
