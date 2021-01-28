package com.sysgears.chat.model;

import com.sysgears.upload.model.FileMetadata;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.Fetch;
import org.hibernate.annotations.FetchMode;
import org.hibernate.annotations.GenericGenerator;
import org.springframework.data.annotation.CreatedDate;

import javax.persistence.*;
import java.time.Instant;
import java.util.UUID;

@Entity
@Data
@NoArgsConstructor
@Table(name = "MESSAGE")
public class Message {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO, generator = "native")
    @GenericGenerator(name = "native", strategy = "native")
    private int id;

    @Column(name = "TEXT")
    private String text;

    @Column(name = "USER_ID")
    private Integer userId;

    @CreatedDate
    @Column(name = "CREATED_AT", updatable = false)
    private final Instant createdAt = Instant.now();

    @Column(name = "USERNAME")
    private String username;

    @Column(name = "UUID")
    private UUID uuid;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "QUOTED_ID")
    private Message quoted;

    @OneToOne
    @Fetch(FetchMode.JOIN)
    @JoinColumn(name = "attachment_id")
    private FileMetadata attachment;
}